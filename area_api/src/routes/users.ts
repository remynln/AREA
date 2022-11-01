import { Router } from "express";
import db from "~/database/db";
import checkToken from "~/middlewares/checkToken";


var router = Router()

router.get("/", (req, res, next) => {
    let limit = Number(req.query.limit) || 100
    let page = Number(req.query.page) || 0
    db.user.getMany(limit, page).then((users) => {
        res.status(200).json(
            users.map((item) => {
                return {
                    id: item._id.toHexString(),
                    username: item.username,
                    email: item.mail,
                    admin: item.admin
                }
            })
        )
    }).catch((err) => {
        next(err)
    })
})

export default router