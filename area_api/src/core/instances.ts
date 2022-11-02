import { Types } from "mongoose";
import db from "~/database/db";
import { Area } from "./types";


var areas: Map<string, Area> = new Map([])

const AreaInstances = {
    get(id: string) {
        let objectId
        return areas.get(id)
    },
    list(accountMail: string) {
        return Array.from(areas.entries())
            .filter(([_, value]) => value.accountMail == accountMail)
    },
    async add(area: Area) {
        let id = await db.area.set(area)
        areas.set(id.toHexString(), area)
    }
}

export default AreaInstances