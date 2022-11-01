import { Router } from "express";
import db from "~/database/db";
import User from "~/models/user";

var router = Router()


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