import { NextFunction, Request, Response, Router } from "express";
import mongoose from "mongoose";
import AreaInstances from "~/core/instances";
import db from "~/database/db";
import subRouter from "./get"

let areaRouter = Router()

areaRouter.use("/:areaId", (req, res, next) => {
    db.user.getFromMail(res.locals.userInfo.email).then((user) => {
        let area = AreaInstances.get(req.params.areaId)
        if (!area) {
            res.status(404).send(`Area with id ${req.params.areaId} not found`)
            return
        }
        if (user.mail != area.accountMail && !user.admin) {
            res.status(403).send({
                message: "You don't have right to access this area"
            })
            return
        }
        res.locals.areaInfo = {
            id: req.params.areaId,
            title: area.title,
            description: area.description,
            action: {
                name: area.actionConf.serviceName + '/' + area.actionConf.name,
                parameters: area.action.params
            },
            condition: area.condition,
            reaction: {
                name: area.reactionConf.serviceName + '/' + area.reactionConf.name,
                parameters: area.reactionParams
            }
        }
        next()
    }).catch((err) => {
        next(err)
    })
}, subRouter)


export default areaRouter