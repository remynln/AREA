import { Router } from "express";
import db from "~/database/db";


var areasRouter = Router({mergeParams: true})

areasRouter.get('/', (req, res, next) => {
    db.area.getFromUser(res.locals.targetUser).then((areas) => {
        let mapped = areas.map((item) => {
            return {
                id: item._id.toHexString(),
                title: item.title,
                description: item.description,
                action: item.action,
                condition: item.condition,
                reaction: item.reaction
            }
        })
        res.status(200).json(mapped)
    }).catch((err) => {
        next(err)
    })
})

export default areasRouter