import { AxiosError } from "axios";
import { Types } from "mongoose";
import { ScheduledTask } from "node-cron";
import cron from "node-cron";
import db from "~/database/db";
import { Area } from "./area";
import { AreaError, DatabaseError, ProcessError } from "./errors";
import global from "./global";
import { ActionConfig, ReactionConfig, Tokens } from "./types";

// This map stores areas instances, with db trigger id as key
var areas: Map<string, Area> = new Map([])

// This map stores areas instances, with action'sService name as key
var areasServiceIndex: Map<string, Area[]> = new Map([])

//cron associated with service to poll event from actions
var cronTasks: Map<string, { task: ScheduledTask, current: number}> = new Map([])

async function filterAsync<T>(arr: T[], predicate: (item: T) => Promise<boolean>) {
    const results: boolean[] = []
    for (let i of arr) {
        results.push(await predicate(i))
    }
    return arr.filter((_v, index) => results[index]);
}

// This map stores access and refresh token for each users,
// with user's mail as key, the second key is service name
var tokens: Map<string, Map<string, Tokens>> = new Map([])

function callbackErrorFun(err: ProcessError) {
    console.log("new error from: " + err.serviceName + "/" + err.name);
    if (err.err instanceof AxiosError) {
        console.log("axios error")
        console.log(err.err.response)
    } else {
        console.log(err.err)
    }
}

export interface AreaConfig {
    title: string,
    description: string
    action: { conf: ActionConfig, params: any }
    condition: string
    reaction: { conf: ReactionConfig, params: any }
}

function createCron(serviceName: string) {
    console.log("cron creation")
    return cron.schedule("*/5 * * * * *", () => {
        let selectedCron = cronTasks.get(serviceName)
        if (!selectedCron)
        return
        let selectedAreas = areasServiceIndex.get(serviceName)
        if (!selectedAreas)
        return
        if (selectedAreas.length == 0)
        return
        console.log("looping", serviceName, selectedCron.current)
        let end = selectedCron.current
        do {
            if (selectedCron.current >= selectedAreas.length)
                selectedCron.current = 0
            if (selectedAreas[selectedCron.current].status == "started") {
                selectedAreas[selectedCron.current].loop()
                selectedCron.current = selectedCron.current + 1
                return
            }
            selectedCron.current = selectedCron.current + 1
        } while (selectedCron.current != end)
    })
}

const AreaInstances = {
    get(id: string) {
        return areas.get(id)
    },
    async list(accountId: string) {
        let user = await db.user.get(accountId)
        return Array.from(areas.entries())
            .filter(([_, value]) => value.accountMail == user.mail)
    },
    async addToCronTasks(area: Area) {
        let serviceName = area.actionConf.serviceName || ''
        var selected = areasServiceIndex.get(serviceName)
        if (!selected) {
            selected = []
            areasServiceIndex.set(serviceName, selected)
        }
        selected.push(area)
        if (cronTasks.has(serviceName))
            return
        var newCron = createCron(serviceName)
        cronTasks.set(serviceName, {
            task: newCron,
            current: 0
        })
    },
    async add(area: AreaConfig, accountMail: string) {
        let _tokens = tokens.get(accountMail)
        if (!_tokens) {
            let user = await db.user.getFromMail(accountMail)
            _tokens = await db.token.getFromUser(user._id)
            tokens.set(accountMail, _tokens)
        }
        let instance = new Area(
            accountMail,
            _tokens,
            area.title,
            area.description,
            area.action,
            area.condition,
            area.reaction,
            callbackErrorFun
        )
        await db.area.checkValidity(instance)
        await instance.start()
        let id = await db.area.set(instance)
        this.addToCronTasks(instance)
        areas.set(id.toHexString(), instance)
    },
    async load() {
        console.log("starting area instances")
        await db.area.forEach(async (accMail, newTokens, area) => {
            if (!tokens.has(accMail)) {
                tokens.set(accMail, newTokens)
            }
            try {
                let action = global.getAction(area.action)
                let reaction = global.getReaction(area.reaction)
                if (!action || !reaction) {
                    throw Error("Action or reaction does not exists")
                }
                let areaInstance = new Area(
                    accMail,
                    tokens.get(accMail)!,
                    area.title,
                    area.description,
                    {
                        conf: action,
                        params: area.action_params != '' ? JSON.parse(area.action_params) : ''
                    },
                    area.condition,
                    {
                        conf: reaction,
                        params: area.reaction_params != '' ? JSON.parse(area.reaction_params) : ''
                    },
                    callbackErrorFun
                )
                areas.set(area._id.toHexString(), areaInstance)
                this.addToCronTasks(areaInstance)
                if (area.status == "enabled" && areaInstance.status != "locked") {
                    await areaInstance.start()
                    await new Promise(r => setTimeout(r, 2000));
                }
                if (area.status == "locked")
                    areaInstance.status = "locked"
            } catch (err) {
                callbackErrorFun(new ProcessError("", "area init", err))
            }
        })
        console.log("instances started")
    },
    async enable(areaId: string) {
        let area = areas.get(areaId)
        if (!area)
            throw new AreaError(`area with code ${areaId} does not exists`, 404)
        await area.start()
        await db.area.setStatus(areaId, "enabled")
    },
    async disable(areaId: string) {
        let trigger = await db.area.get(areaId)
        if (trigger.status?.startsWith("locked"))
            throw new AreaError(`can't start trigger: not connected to ${trigger.status?.split(' ')[1]}`, 401)
        let area = areas.get(areaId)
        if (!area)
            throw new AreaError(`area with code ${areaId} does not exists`, 404)
        await area.stop()
        await db.area.setStatus(areaId, "disabled")
    },
    async delete(areaId: string) {
        let area = areas.get(areaId)
        if (!area)
            throw new DatabaseError(`area with id '${area} not found`, 404)
        if (area.status != "stopped" && area.status != "locked" && area.status != "errored")
            area.stop()
        areas.delete(areaId)
        await db.area.delete(areaId)
    },
    async disconnectFromService(email: string, serviceName: string) {
        let service = global.services.get(serviceName)
        if (!service)
            throw new AreaError(`Service with name '${serviceName}' does not exists`, 404)
        let user = await db.user.getFromMail(email)
        for (let [key, value] of areas.entries()) {
            if (value.accountMail != email)
                continue
            if (value.actionConf.serviceName != serviceName && value.reactionConf.serviceName != serviceName)
                continue
            try {
                await value.forceStop()
            } catch (err) {
                callbackErrorFun(new ProcessError(value.actionConf.serviceName || 'None', value.actionConf.name, err))
            }
            value.status = "locked"
            await db.area.setStatus(key, "locked")
        }
        let tok = tokens.get(user.mail || '')
        if (!tok)
            return
            let serviceTok = tok.get(serviceName)
        if (!serviceTok)
            return
        if (serviceTok.dbId)
            await db.token.delete(serviceTok.dbId)
        tok.delete(serviceName)
    },
    async connectToService(email: string, serviceName: string) {
        // Update tokens
        let user = await db.user.getFromMail(email)
        let _tokens = await db.token.getFromUser(user._id)
        let _serviceTokens = _tokens.get(serviceName)
        if (!_serviceTokens)
            return
        let userTokens = tokens.get(email)
        if (!userTokens) {
            userTokens = new Map([])
            tokens.set(email, userTokens)
        }
        userTokens.set(serviceName, _serviceTokens)

        //change updated tokens
        for (let [key, value] of areas.entries()) {
            if (value.accountMail != email)
                continue
            if (value.actionConf.serviceName != serviceName && value.reactionConf.serviceName != serviceName)
                continue
            if (value.actionConf.serviceName == serviceName) {
                value.actionTokens = _serviceTokens
                value.action.token = _serviceTokens.access
            }
            if (value.reactionConf.serviceName == serviceName) {
                value.reactionTokens = _serviceTokens
                value.reaction.token = _serviceTokens.access
            }
            if (value.status != "locked")
                continue
            if (
                userTokens.has(value.actionConf.serviceName || '') &&
                userTokens.has(value.reactionConf.serviceName || '')
            ) {
                value.status = "stopped"
                await db.area.setStatus(key, "disabled")
            }
        }
    }
}

export default AreaInstances