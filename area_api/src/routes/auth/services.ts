import passport, { Strategy } from "passport";
import express, { Request, Response, Router } from "express";
import "dotenv/config"
import url from "url";
import jwt from "jsonwebtoken";
import Area from "../../core/global"
import global from "../../core/global";
import db from "~/database/db";
import JwtFormat from "./jwtFormat";
import AreaInstances from "~/core/instances";

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
        return
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
    authParams.callbackURL = "/auth/service/" + req.params.serviceName + "/callback"
    authParams.state = req.query.callback as string
    passport.authenticate(req.params.serviceName, authParams)(req, res)
}, (req, res) => {
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
    authParams.failureRedirect = process.env.DOMAIN + "/"
    authParams.callbackURL = "/auth/service/" + req.params.serviceName + "/callback"
    passport.authenticate(req.params.serviceName, authParams, (err, user, info) => {
        res.locals.user = user;
        next()
    })(req, res, next)
}, (req, res, next) => {
    if (req.errored || !res.locals.user.data || !res.locals.user.username
        || !res.locals.user.accessToken || !res.locals.user.refreshToken) {
        res.status(500).json({
            message: "Internal server error"
        });
        return;
    }
    db.loginService(
        req.params.serviceName,
        res.locals.user.data,
        res.locals.user.username).then(([mail, admin]) => {
        db.setToken(res.locals.user.accessToken, res.locals.user.refreshToken, mail,req.params.serviceName).then(() => {
            let token: JwtFormat = {
                email: mail,
                username: res.locals.username,
                admin: admin
            }
            AreaInstances.connectToService(mail, req.params.serviceName)
            res.redirect(url.format({
                pathname: req.query.state as string,
                query: {
                    token: jwt.sign(token, process.env.JWT_KEY || "")
                }
            }))
        }).catch((err) => next(err))
    }
    ).catch((err) => next(err))
})

export default router