import { Router } from "express";


var area: Router = Router()

area.use("/create", (req, res) => {
    res.send("ok")
})

export default area;