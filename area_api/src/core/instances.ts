import { Types } from "mongoose";
import db from "~/database/db";
import { Area, Tokens } from "./types";

// This map stores areas instances, with db trigger id as key
var areas: Map<string, Area> = new Map([])

// This map stores access and refresh token for each users,
// with user's mail as key, the second key is service name
var tokens: Map<string, Map<string, Tokens>> = new Map([])

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
        await area.start((err) => {
            console.log("area error", err)
        })
    },
    async load() {
        
    }
}

export default AreaInstances