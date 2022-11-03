import { AxiosError } from "axios";
import { Types } from "mongoose";
import db from "~/database/db";
import { ProcessError } from "./errors";
import global from "./global";
import { Area, Tokens } from "./types";

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

const AreaInstances = {
    get(id: string) {
        let objectId
        return areas.get(id)
    },
    list(accountMail: string) {
        return Array.from(areas.entries())
            .filter(([_, value]) => value.accountMail == accountMail)
    },
    async add(area: Area, accountMail: string) {
        let _tokens = tokens.get(accountMail)
        if(!_tokens) {
            let user = await db.user.getFromMail(accountMail)
            _tokens = await db.token.getFromUser(user._id)
            tokens.set(accountMail, _tokens)
        }
        await area.setTokens(_tokens, accountMail)
        let id = await db.area.set(area)
        areas.set(id.toHexString(), area)
        await area.start(callbackErrorFun)
    },
    async load() {
        console.log("starting area instances")
        await db.area.forEach(async (accMail, newTokens, area) => {
            if (!tokens.has(accMail))
                tokens.set(accMail, newTokens)
            try {
                let action = global.getAction(area.action)
                let reaction = global.getReaction(area.reaction)
                console.log("area.action_params", area.action_params)
                let areaInstance = new Area(
                    action,
                    area.action_params == '' ? undefined : JSON.parse(area.action_params),
                    area.condition,
                    reaction,
                    JSON.parse(area.reaction_params),
                    area.title,
                    area.description,
                )
                await areaInstance.setTokens(tokens.get(accMail)!, accMail)
                areas.set(area._id.toHexString(), areaInstance)
                await areaInstance.start(callbackErrorFun)
                console.log("yes yes yes")
            } catch (err) {
                console.log("area initiation error", err)
            }
        })
        console.log("instanciated")
    }
}

export default AreaInstances