import { Request, Response, Router } from 'express'
import google from "./services"
import checkBody from '~/middlewares/checkBody'

var auth: Router = Router()

auth.post('/register',
    checkBody(["email", "username", "password"]), (req: Request, res: Response) => {
    res.status(200).json({
        nice : "ok"
    })
})

auth.use("/service", google)

export default auth