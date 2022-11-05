import passport, { Strategy } from "passport";
import express, { Router } from "express";
import "dotenv/config"
import url from "url";
import jwt from "jsonwebtoken";
import Area from "../../core/global"
import AreaInstances from "~/core/instances";

var router: Router = Router()

router.delete("/:serviceName", (req, res, next) => {
    AreaInstances.disconnectFromService(res.locals.userInfo.email, req.params.serviceName)
        .catch((err) => {
        next(err)
    }).then(() => {
        res.status(200).json({
            message: "OK"
        })
    })
})

export default router