import { Request, Response, Router } from 'express'
import google from "./auth/google"

var login: Router = Router()

//login.get('/:serviceName', (req: Request, res: Response) => {
//    res.send(req.params.serviceName)
//})

login.use("/service", google)

export default login