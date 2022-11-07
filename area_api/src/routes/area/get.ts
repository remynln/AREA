import { Router } from "express";
import AreaInstances from "~/core/instances";


let router = Router()

router.get("/", (req, res) => {
    res.status(200).send(
        res.locals.areaInfo
    )
})

router.put("/enable", (req, res, next) => {
    console.log("bizarre")
    AreaInstances.enable(res.locals.areaInfo.id).then(() => {
        res.status(200).send({
            message: "OK"
        })
    }).catch((err) => {
        next(err)
    })
})

router.put("/disable", (req, res, next) => {
    AreaInstances.disable(res.locals.areaInfo.id).then(() => {
        res.status(200).send({
            message: "OK"
        })
    }).catch((err) => {
        next(err)
    })
})

export default router