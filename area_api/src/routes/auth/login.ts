import { Request, Response, Router } from 'express'
import google from "./services"
import checkBody from '~/middlewares/checkBody'
import jwt from "jsonwebtoken"
import db from '~/database/db'
import { Message } from '@google-cloud/pubsub'

var auth: Router = Router()

function isMailValid(email: string) {
    return (/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email))
}

function isUserNameValid(username: string) {
    return (/^[A-Z0-9._%+-]{2,}$/i.test(username))
}

function isPasswordValid(username: string) {
    return (/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/i.test(username))
}

auth.post('/register', checkBody(["email", "username", "password"]), async (req: Request, res: Response) => {
    if (!isMailValid(req.body.email)) {
        res.status(400).json({ message: "invalid email"})
        return;
    }
    if (!isUserNameValid(req.body.username)) {
        res.status(400).json({ message: "invalid username"})
        return;
    }
    if (!isPasswordValid(req.body.password)) {
        res.status(400).json({ message: "invalid password"})
        return;
    }
    let is_err = false;
    await db.register(req.body.password, req.body.email, req.body.username, (err) => {
        if (err) {
            is_err = true;
            res.status(400).json({ message: "user already exists"})
        }
    })
    if (is_err)
        return
    res.status(200).json({
        token: jwt.sign({ email: req.body.email }, process.env.JWT_KEY || '')
    })
    return
})

auth.post('/login', checkBody(["email", "password"]), async (req, res) => {
    let is_err = false
    if (!req.body.email || !req.body.password) {
        res.status(400).json({ message: "missing email or password"})
        return
    }
    const password_check = await db.login(req.body.password, req.body.email, (err) => {
        if (err) {
            is_err = true
            res.status(400).json({ message: "invalid credentials"})
            return
        }
    })
    if (is_err)
        return
    if (!password_check) {
        res.status(400).json({message: "Invalid password"})
        return
    }
    res.status(200).json({
        token: jwt.sign({ email: req.body.email }, process.env.JWT_KEY || '')
    })
})

auth.use("/service", google)

export default auth