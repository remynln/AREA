import passport, { Strategy } from "passport";
import express, { Request, Response, Router } from "express";
import "dotenv/config"
import url from "url";
import jwt from "jsonwebtoken";
import Area from "../../core/global"

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

router.get('/:serviceName', (req, res) => {
    if (!req.query.callback) {
        res.status(403).send("Missing callback_url")
    }
    const state = req.query.callback as string
    passport.authenticate(req.params.serviceName, {
        state: state,
        callbackURL: "/service/google/callback",
        scope: ['profile', 'email',
            'https://mail.google.com/']
    } as any)(req, res)
}, (req, res) => {
    console.log("nsm")
})

router.get('/:serviceName/callback', (req, res, next) => {
    passport.authenticate(req.params.serviceName, {
        failureRedirect: "http://localhost:8080/",
        callbackURL: "/service/google/callback",
        scope: ['profile', 'email',
            'https://mail.google.com/']
    } as any, (err, user, info) => {
        console.log("user: ", user)
        res.locals.user = user;
        next()
    })(req, res, next)
}, (req, res) => {
    if (req.errored || !res.locals.user) {
        res.status(500).json({
            message: "Internal server error"
        });
        return;
    }
    res.redirect(url.format({
        pathname: req.query.state as string,
        query: {
            token: jwt.sign(res.locals.user, process.env.JWT_KEY || "")
        }
    }))
})

export default router