import passport, { Strategy } from "passport";
import express, { Request, Response, Router } from "express";
import "dotenv/config"
import url from "url";
import jwt from "jsonwebtoken";
import Area from "../../core/global"
import global from "../../core/global";
import db from "~/database/db";
import JwtFormat from "./jwtFormat";

var router: Router = express.Router()

router.use(passport.initialize())

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user: Express.User, done) => {
    done(null, user);
});

for (var i of Area.services) {
    passport.use(i[1].strategy)
}

router.get('/:serviceName', (req, res) => {
    if (!req.query.callback) {
        res.status(403).send("Missing callback_url")
    }
    let service = global.services.get(req.params.serviceName)
    if (!service) {
        res.status(404).json({
            message: `Service '${req.params.serviceName}' not found`
        })
        return
    }
    let authParams = service.authParams;
    authParams.failureRedirect = req.query.callback as string
    authParams.callbackURL = `/auth/service/${req.params.serviceName}/callback`
    authParams.state = req.query.callback as string
    passport.authenticate(service.strategy, authParams)(req, res)
}, (req, res) => {
    console.log("nsm")
})

router.get('/:serviceName/callback', (req, res, next) => {
    let service = global.services.get(req.params.serviceName)
    if (!service) {
        res.status(404).json({
            message: `Service '${req.params.serviceName}' not found`
        })
        return
    }
    let authParams = service.authParams;
    authParams.failureRedirect = "http://localhost:8080/"
    authParams.callbackURL = `/auth/service/${req.params.serviceName}/callback`
    passport.authenticate(service.strategy, authParams, (err, user, info) => {
        console.log("user: ", user)
        res.locals.user = user;
        next()
    })(req, res, next)
}, (req, res) => {
    if (req.errored || !res.locals.user.data || !res.locals.user.username
        || !res.locals.user.accessToken || !res.locals.user.refreshToken) {
        console.log(res.locals.user.accessToken, res.locals.user.refreshToken)
        res.status(500).json({
            message: "Internal server error"
        });
        return;
    }
    db.loginService(
        req.params.serviceName,
        res.locals.user.data,
        res.locals.user.username).then((mail) => {
        db.setToken(res.locals.user.accessToken, res.locals.user.refreshToken, mail,req.params.serviceName).then(() => {
            let token: JwtFormat = {
                email: mail,
                username: res.locals.username
            }
            res.redirect(url.format({
                pathname: req.query.state as string,
                query: {
                    token: jwt.sign(token, process.env.JWT_KEY || "")
                }
            }))
        })
    }
    ) 
})

export default router