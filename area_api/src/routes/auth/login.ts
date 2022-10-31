import { Request, Response, Router } from 'express'
import google from "./services"
import checkBody from '~/middlewares/checkBody'
import jwt from "jsonwebtoken"
import db from '~/database/db'
import { Message } from '@google-cloud/pubsub'
import { debug } from 'console'
import checkToken from '~/middlewares/checkToken'
import JwtFormat from './jwtFormat'

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

auth.post('/register', checkBody(["email", "username", "password"]), (req: Request, res: Response, next) => {
    if (!isMailValid(req.body.email)) {
        res.status(400).json({ message: "Invalid email"})
        return;
    }
    if (!isUserNameValid(req.body.username)) {
        res.status(400).json({ message: "Invalid username"})
        return;
    }
    if (!isPasswordValid(req.body.password)) {
        res.status(400).json({ message: "Invalid password"})
        return;
    }
    db.register(req.body.password, req.body.email, req.body.username).then(() => {
        res.status(201).json({
            token: jwt.sign({
                email: req.body.email,
                username: req.body.username
            } as JwtFormat, process.env.JWT_KEY || '')
        })
    }).catch((err) => {
        next(err)
    })
})

auth.post('/login', checkBody(["email", "password"]), (req, res, next) => {
    if (!req.body.email || !req.body.password) {
        res.status(400).json({ message: "Missing email or password"})
        return
    }
    db.login(req.body.password, req.body.email).then((token) => {
        if (!token) {
            res.status(400).json({message: "Invalid password"})
            return
        }
        res.status(200).json({
            token: jwt.sign(token,
                process.env.JWT_KEY || '')
        })
    }).catch((err) => {
        next(err)
    })
})

auth.delete("/unregister", checkToken, (req, res) => {
    let token = jwt.decode(req.headers.authorization?.split(' ')[1] || '') as JwtFormat
    let mail = token.email;
    res.status(200).send({
        email: mail
    })
    // TODO integrate database comm to delete account
})

auth.use("/service", google)

export default auth