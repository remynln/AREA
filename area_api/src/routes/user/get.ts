import { Router } from "express";
import db from "~/database/db";
import User from "~/models/user";
import { UserPut } from "~/database/user/update"
import AreaInstances from "~/core/instances";
var router = Router()

router.delete("/", (req, res, next) => {
    db.user.delete(res.locals.targetUser).then((user) => {
        AreaInstances.deleteUser(user.mail || '')
        res.status(200).json({
            message: "OK"
        })
    }).catch((err) => {
        next(err)
    })
})

router.put("/", (req, res, next) => {
    let values: UserPut = {
        admin: req.body.admin || undefined,
        username: req.body.username || undefined
    }
    if (values.admin != undefined && res.locals.userInfo.email != "root") {
        res.status(403).json({
            message: "Only root have right to set admin"
        })
        return
    }
    db.user.update(res.locals.targetUser, req.body).then((user) => {
        res.status(200).json({
            message: "OK"
        })
    }).catch((err) => {
        next(err)
    })
})

router.get("/", (req, res, next) => {
    db.user.get(res.locals.targetUser).then((user) => {
        res.status(200).json({
            username: user.username,
            email: user.mail,
            admin: user.admin,
            createdAt: (user as any).createdAt || null,
            updatedAt: (user as any).updatedAt || null
        })
    }).catch((err) => {
        next(err)
    })
})

export default router