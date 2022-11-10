import { Router } from "express";
import moment from "moment"
import requestIp from "request-ip"
let aboutRouter = Router()

aboutRouter.get("/", (req, res, next) => {
    let clientIp = req.socket.remoteAddress?.split(':') || ['']
    let _json = {
        client: {
            host: clientIp[clientIp.length - 1]
        },
        server: {
            time: moment().valueOf()
        }
    }
    res.status(200).json(_json)
})

export default aboutRouter