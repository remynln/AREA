import { Router } from "express";
import db from "~/database/db";
import JwtFormat from "../auth/jwtFormat";
import jwt from "jsonwebtoken"
import global from "~/core/global"

var router = Router()

router.get('/', (req, res) => {
    let decoded = jwt.decode(req.headers.authorization?.split(' ')[1] || '')
    db.getServices((decoded as JwtFormat).email)
    .then((connectedServices) => {
        res.status(200).json({
            connected: connectedServices,
            not_connected: Array.from(global.services.keys()).filter((elem) =>
                !connectedServices.includes(elem)
            )
        })
    })
})

export default router