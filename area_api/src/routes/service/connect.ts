import passport, { Strategy } from "passport";
import express, { Router } from "express";
import "dotenv/config"
import url from "url";
import jwt from "jsonwebtoken";
import Area from "../../core/global"
import AreaInstances from "~/core/instances";
import JwtFormat from "../auth/jwtFormat";

var router: Router = Router()

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

router.get('/:serviceName', (req, res, next) => {
    if (!req.query.callback) {
        res.status(403).send("Missing callback_url")
    }
    let service = Area.services.get(req.params.serviceName)
    if (!service) {
        res.status(404).json({
            message: `Service '${req.params.serviceName}' not found`
        })
        return
    }
    let authParams = service.authParams;
    if (!req.query.callback || !req.query.jwt) {
        res.status(400).json({
            message: "Missing query parameters"
        })
    }
    if (!jwt.verify(req.query.jwt as string, process.env.JWT_KEY || '')) {
        res.status(401).json({ message: "Invalid token" })
        return
    }
    authParams.state = req.query.callback as string + " " + req.query.jwt as string
    authParams.callbackURL = "/service/" + req.params.serviceName +
        `/callback?state=${authParams.state}`
    passport.authenticate(req.params.serviceName, authParams)(req, res, next)
}, (req, res) => {
})

router.get('/:serviceName/callback', (req, res, next) => {
    let service = Area.services.get(req.params.serviceName)
    if (!service) {
        res.status(404).json({
            message: `Service '${req.params.serviceName}' not found`
        })
        return
    }
    let authParams = service.authParams;
    authParams.failureRedirect = "http://localhost:8080/"
    authParams.callbackURL = "/service/" + req.params.serviceName + "/callback"
    passport.authenticate(req.params.serviceName, authParams, (err, user, info) => {
        if (err)
            console.log(err)
        console.log("user: ", user)
        res.locals.user = user;
        next()
    })(req, res, next)
}, (req, res, next) => {
    if (req.errored || !res.locals.user) {
        res.status(500).json({
            message: "Internal server error"
        });
        return;
    }
    let splitted = req.query.state?.toString().split(' ')
    let userInfo = jwt.decode(splitted![1]) as JwtFormat
    console.log("userInfo", req.query.state)
    AreaInstances.connectToService(userInfo.email, req.params.serviceName).then(() => {
        res.redirect(splitted![0])
    }).catch((err) => {
        next(err)
    })
})


export default router