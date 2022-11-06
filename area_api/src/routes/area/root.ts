import { NextFunction, Request, Response, Router } from "express";
import mongoose from "mongoose";
import db from "~/database/db";
import subRouter from "./get"

let areaRouter = Router()

areaRouter.use("/:areaId", (req, res, next) => {
    db.user.getFromMail(res.locals.userInfo.email).then((user) => {
        db.area.get(req.params.areaId).then((area) => {
            if (user._id.toHexString() == area.user_id?.cacheHexString) {
                console.log(user._id, area.user_id?.cacheHexString)
                res.status(403).send({
                    message: "You don't have right to access this area"
                })
                return
            }
            res.locals.areaInfo = {
                id: area._id.toHexString(),
                title: area.title,
                description: area.description,
                action: {
                    name: area.action,
                    parameters: area.action_params
                },
                condition: area.condition,
                reaction: {
                    name: area.reaction,
                    parameters: area.reaction_params
                }
            }
            next()
        }).catch((err) => {
            next(err)
        })
    }).catch((err) => {
        next(err)
    })
}, subRouter)


export default areaRouter