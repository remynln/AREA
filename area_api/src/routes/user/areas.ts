import { Router } from "express";
import AreaInstances from "~/core/instances";
import db from "~/database/db";


var areasRouter = Router({mergeParams: true})

areasRouter.get('/', (req, res, next) => {
    AreaInstances.list(res.locals.targetUser).then((areas) => {
        let mapped = areas.map((item) => {
            return {
                id: item[0],
                title: item[1].title,
                description: item[1].description,
                action: item[1].actionConf.serviceName + '/' + item[1].actionConf.name,
                reaction: item[1].reactionConf.serviceName + '/' + item[1].reactionConf.name,
                status: item[1].status
            }
        })
        res.status(200).json(mapped)
    }).catch((err) => {
        next(err)
    })
})

export default areasRouter