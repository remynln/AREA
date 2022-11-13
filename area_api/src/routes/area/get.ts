import { Router } from "express";
import AreaInstances from "~/core/instances";


let router = Router()

router.get("/", (req, res) => {
    res.status(200).send(
        res.locals.areaInfo
    )
})

router.delete("/", (req, res, next) => {
    AreaInstances.delete(res.locals.areaInfo.id).then(() => {
        res.status(200).json({
            message: "OK"
        })
    }).catch((err) => {
        next(err)
    })
})

router.put("/enable", (req, res, next) => {
    AreaInstances.enable(res.locals.areaInfo.id).then(() => {
        res.status(200).json({
            message: "OK"
        })
    }).catch((err) => {
        next(err)
    })
})

router.put("/disable", (req, res, next) => {
    AreaInstances.disable(res.locals.areaInfo.id).then(() => {
        res.status(200).json({
            message: "OK"
        })
    }).catch((err) => {
        next(err)
    })
})

export default router