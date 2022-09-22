import { Router } from 'express'

var login: Router = Router()

login.get('/', (req, res) => {
    res.send("login get method")
})

export default login