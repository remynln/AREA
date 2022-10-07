import { Router } from "express";
import checkToken from "~/middlewares/checkToken";


var area: Router = Router()

area.use("/create", checkToken, (req, res) => {
    res.send("ok")
})

export default area;