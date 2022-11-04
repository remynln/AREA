import { Router } from "express";


let router = Router()

router.get("/", (req, res) => {
    res.status(200).send(
        res.locals.areaInfo
    )
})

export default router