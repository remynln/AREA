import { AxiosError } from "axios";
import { Types } from "mongoose";
import { ScheduledTask } from "node-cron";
import cron from "node-cron";
import db from "~/database/db";
import { Area } from "./area";
import { AreaError, DatabaseError, ProcessError } from "./errors";
import global from "./global";
import { ActionConfig, ReactionConfig, Tokens } from "./types";


const AREA_START_DELTA = 4000
const SERVICE_START_DELTA = 333
const AREA_LOOP_DELTA = "*/5 * * * * *"
const SERVICE_LOOP_DELTA = 416

// This map stores areas instances, with db trigger id as key
var areas: Map<string, Area> = new Map([])

// This map stores areas instances, with action'sService name as key


interface CronTask {
    task: ScheduledTask | undefined
    current: number
    areas: Area[]
}


function cronTaskFun(cronTask: CronTask) {
    let itNumber = 0
    while (cronTask.areas[cronTask.current].status != "started") {
        if (itNumber > cronTask.areas.length)
            return
        cronTask.current++;
        itNumber++;
        if (cronTask.current >= cronTask.areas.length)
            cronTask.current = 0
    }
    cronTask.areas[cronTask.current].loop()
    cronTask.current++;
    if (cronTask.current >= cronTask.areas.length)
        cronTask.current = 0
}
//cron associated with service to poll event from actions
var cronTasks = {
    ref: new Map([]) as Map<string, CronTask>,
    addWithoutCron(area: Area) {
        let serviceName = area.actionConf.serviceName || ''
        var selected = this.ref.get(serviceName)
        if (!selected) {
            let newSelected: CronTask = {
                areas: [area],
                current: 0,
                task: undefined
            }
            this.ref.set(serviceName, newSelected)
            return
        }
        selected.areas.push(area)
    },
    add(area: Area) {
        let serviceName = area.actionConf.serviceName || ''
        var selected = this.ref.get(serviceName)
        if (!selected) {
            let newSelected: CronTask = {
                areas: [area],
                current: 0,
                task: undefined
            }
            newSelected.task = cron.schedule(AREA_LOOP_DELTA, () => {
                cronTaskFun(newSelected)
            })
            this.ref.set(serviceName, newSelected)
            return
        }
        selected.areas.push(area)
    },
    delete(area: Area) {
        let serviceName = area.actionConf.serviceName || ''
        let selected = this.ref.get(serviceName)
        if (!selected)
            return
        let index = selected.areas.indexOf(area)
        if (index == -1)
            return
        selected.areas.splice(index, 1)
        if (selected.current > index)
            selected.current--;
    }
}

async function filterAsync<T>(arr: T[], predicate: (item: T) => Promise<boolean>) {
    const results: boolean[] = []
    for (let i of arr) {
        results.push(await predicate(i))
    }
    return arr.filter((_v, index) => results[index]);
}

// This map stores access and refresh token for each users,
// with user's mail as key, the second key is service name
var tokens = {
    ref: new Map([]) as Map<string, Map<string, Tokens>>,
    getOne(email: string, service: string) {
        let selectedUser = this.ref.get(email)
        if (!selectedUser)
            return undefined
        return selectedUser.get(service)
    },
    getUser(email: string) {
        return this.ref.get(email)
    },
    set(email: string, tokens: Map<string, Tokens>) {
        this.ref.set(email, tokens)
    },
    setOne(email: string, service: string, token: Tokens) {
        let userTokens = this.ref.get(email)
        if (!userTokens) {
            let newUserTokens = new Map([[service, token]])
            this.ref.set(email, newUserTokens)
            return
        }
        userTokens.set(service, token)
    },
    delete(email: string, service: string) {
        let selectedUser = this.ref.get(email)
        if (!selectedUser)
            return
        selectedUser.delete(service)
    }
}



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

const loadFunctions = {
    async loadDb() {
        await db.area.forEach(async (email, newUserTokens, trigger) => {
            if (!tokens.getUser(email))
                tokens.set(email, newUserTokens)
            let userTokens = tokens.getUser(email)
            if (!userTokens)
                return
            let actionConf = global.getAction(trigger.action)
            let reactionConf = global.getReaction(trigger.reaction)
            if (!actionConf || !reactionConf)
                return
            let instance = new Area(
                email,
                userTokens,
                trigger.title,
                trigger.description,
                { conf: actionConf, params: trigger.action_params != "" ? JSON.parse(trigger.action_params) : {}},
                trigger.condition,
                { conf: reactionConf, params: trigger.reaction_params != "" ? JSON.parse(trigger.reaction_params) : {}},
                callbackErrorFun
            )
            instance.dbStatus = trigger.status
            areas.set(trigger._id.toHexString(), instance)
        })
    },
    async loadCronSystem() {
        for (let [key, value] of areas) {
            cronTasks.addWithoutCron(value)
        }
        var promises: Promise<void>[] = []
        for (let [key, value] of cronTasks.ref) {
            for (let i of value.areas) {
                if (i.status == "locked" || i.dbStatus != "enabled")
                    continue
                let promise = i.start()
                promise.catch((err) => {
                    callbackErrorFun(new ProcessError(i.actionConf.serviceName || "None", i.actionConf.name, err))
                })
                promises.push(promise)
                await new Promise(r => setTimeout(r, AREA_START_DELTA));
            }
            await new Promise(r => setTimeout(r, SERVICE_START_DELTA));
        }
        await Promise.all(promises)
        for (let [key, value] of cronTasks.ref) {
            value.task = cron.schedule(AREA_LOOP_DELTA, () => {
                cronTaskFun(value)
            })
            await new Promise(r => setTimeout(r, SERVICE_LOOP_DELTA));
        }
    }
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
    async load() {
        console.log("loading areas...")
        await loadFunctions.loadDb()
        console.log("starting areas...")
        await loadFunctions.loadCronSystem();
        console.log("areas ready")
    },
    async add(area: AreaConfig, accountMail: string) {
        let userTokens = tokens.getUser(accountMail)
        if (!userTokens) {
            throw new AreaError("You are not connected to any services", 403)
        }
        let instance = new Area(
            accountMail,
            userTokens,
            area.title,
            area.description,
            area.action,
            area.condition,
            area.reaction,
            callbackErrorFun
        )
        if (instance.status == "locked") {
            throw new AreaError("You are not connected to the needed services", 403)
        }
        await db.area.checkValidity(instance)
        await instance.start()
        let id = await db.area.set(instance)
        areas.set(id.toHexString(), instance)
        cronTasks.add(instance)
    },
    async enable(areaId: string) {
        let instance = areas.get(areaId)
        if (!instance)
            throw new AreaError(`area with code ${areaId} does not exists`, 404)
        await instance.start()
        await db.area.setStatus(areaId, "enabled")
    },
    async disable(areaId: string) {
        let instance = areas.get(areaId)
        if (!instance)
            throw new AreaError(`area with code ${areaId} does not exists`, 404)
        await instance.stop()
        await db.area.setStatus(areaId, "disabled")
    },
    async disconnectFromService(email: string, serviceName: string) {
        if (!global.services.has(serviceName))
            throw new AreaError(`Service with name '${serviceName}' does not exists`, 404);
        for (let [key, value] of areas) {
            if (
                value.actionConf.serviceName != serviceName &&
                value.reactionConf.serviceName != serviceName
            ) {
                continue
            }
            await value.forceStop()
            value.status = "locked"
            db.area.setStatus(key, "locked")
        }
        await db.token.delete(email, serviceName)
        tokens.delete(email, serviceName)
    },
    async connectToService(email: string, serviceName: string) {
        // Update tokens
        let user = await db.user.getFromMail(email)
        let _tokens = await db.token.getFromUser(user._id)
        let _serviceTokens = _tokens.get(serviceName)
        if (!_serviceTokens)
            return
        tokens.setOne(email, serviceName, _serviceTokens)
        
        for (let [key, value] of areas) {
            if (value.actionConf.serviceName == serviceName) {
                value.actionTokens = _serviceTokens
                value.action.token = _serviceTokens.access
            }
            else if (value.reactionConf.serviceName == serviceName) {
                value.reactionTokens = _serviceTokens
                value.reaction.token = _serviceTokens.access
            } else {
                continue
            }
            if (value.status == "locked")
                value.status = "stopped"
        }
    },
    async delete(areaId: string) {
        let area = areas.get(areaId)
        if (!area)
            throw new DatabaseError(`area with id '${area} not found`, 404)
        if (area.status != "stopped" && area.status != "locked" && area.status != "errored")
            await area.stop()
        cronTasks.delete(area)
        areas.delete(areaId)
        await db.area.delete(areaId)
    }
}

export default AreaInstances