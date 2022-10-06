import { Request, Response, Router } from 'express'
import google from "./auth/google"

var login: Router = Router()

login.get('/', (req: Request, res: Response) => {
    res.send("login get method")
})

login.use("/", google)

export default login