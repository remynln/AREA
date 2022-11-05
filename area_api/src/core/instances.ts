import { AxiosError } from "axios";
import { Types } from "mongoose";
import db from "~/database/db";
import { Area } from "./area";
import { AreaError, ProcessError } from "./errors";
import global from "./global";
import { ActionConfig, ReactionConfig, Tokens } from "./types";

// This map stores areas instances, with db trigger id as key
var areas: Map<string, Area> = new Map([])

// This map stores access and refresh token for each users,
// with user's mail as key, the second key is service name
var tokens: Map<string, Map<string, Tokens>> = new Map([])

function callbackErrorFun(err: ProcessError) {
    console.log("new error from: " + err.serviceName + "/" + err.name);
    if (err.err instanceof AxiosError) {
        console.log("acios error")
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

const AreaInstances = {
    get(id: string) {
        let objectId
        return areas.get(id)
    },
    list(accountMail: string) {
        return Array.from(areas.entries())
            .filter(([_, value]) => value.accountMail == accountMail)
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
        await db.area.set(instance)
        await instance.start()
    },
    async load() {
        console.log("starting area instances")
        await db.area.forEach(async (accMail, newTokens, area) => {
            if (area.status != "enabled")
                return
            if (!tokens.has(accMail))
                tokens.set(accMail, newTokens)
            try {
                let action = global.getAction(area.action)
                let reaction = global.getReaction(area.reaction)
                if (!action || !reaction) {
                    throw Error("Action or reaction does not exists")
                }
                console.log("area.action_params", area.action_params)
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
                await areaInstance.start()
                console.log("yes yes yes")
            } catch (err) {
                console.log("area initiation error", err)
            }
        })
        console.log("instanciated")
    },
    async enable(areaId: string) {
        let area = areas.get(areaId)
        if (!area)
            throw new AreaError(`area with code ${areaId} does not exists`, 404)
        await area.start()
        await db.area.setStatus(areaId, "enabled")
    },
    async disable(areaId: string) {
        let area = areas.get(areaId)
        if (!area)
            throw new AreaError(`area with code ${areaId} does not exists`, 404)
        await area.stop()
        await db.area.setStatus(areaId, "disabled")
    }
}

export default AreaInstances