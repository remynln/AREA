import { Router } from "express";
import moment from "moment"
import requestIp from "request-ip"
let aboutRouter = Router()
import Global from "~/core/global"

aboutRouter.get("/", (req, res, next) => {
    let clientIp = req.socket.remoteAddress?.split(':') || ['']
    let services = [...Global.services].map((item) => {
        return {
            name: item[0],
            actions: [...item[1].actions].map((action) => {
                return {
                    name: action[0],
                    description: action[1].description
                }
            }),
            reactions: [...item[1].reactions].map((reaction) => {
                return {
                    name: reaction[0],
                    description: reaction[1].description
                }
            }),
        }
    })
    let _json = {
        client: {
            host: clientIp[clientIp.length - 1]
        },
        server: {
            time: moment().valueOf(),
            services: services
        }
    }
    res.status(200).json(_json)
})

export default aboutRouter