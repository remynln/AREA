import { Request, Response, Router } from 'express'

var login: Router = Router()

login.get('/', (req: Request, res: Response) => {
    res.send("login get method")
})

export default login