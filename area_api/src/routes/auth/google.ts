import passport, { Strategy } from "passport";
import express, { Request, Response, Router } from "express";
const GoogleStrategy = require("passport-google-oauth20")
import "dotenv/config"
import url from "url";

var router: Router = express.Router()

router.use(passport.initialize())

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user: Express.User, done) => {
    done(null, user);
});

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:8080/login/google/callback",
}, function(accessToken: any, refresh_token: any, profile: any, callback: any) {
    console.log(accessToken, refresh_token, profile)
    callback(null, {
        email: profile.emails[0].value
    })
}))

//router.get('/google', (req, res) => {
//    console.log("azezea", req.query.callback)
//    
//    const callbackUrl: string = req.query.callback as string || ''
//    if (callbackUrl == "") {
//        res.status(403).json({
//            message: "No callback url"
//        })
//        return;
//    }
//    passport.authenticate("google", (req, res) => {
//        console.log("azd")
//    })(req, res)
//});



router.get('/google', (req, res) => {
    if (!req.query.callback) {
        res.status(403).send("Missing callback_url")
    }
    const state = req.query.callback as string     
    passport.authenticate("google", { scope: ['profile', 'email'], state})(req, res)
}, (req, res) => {
    console.log("nsm")
})

router.get('/google/callback', (req, res, next) => {
    passport.authenticate('google', {
        failureRedirect: "http://localhost:8080/"
    }, (err, user, info) => {
        console.log("user: ", user)
        res.locals.user = user;
        next()
    })(req, res, next)
}, (req, res) => {
    console.log("haha", res.locals.user)
    res.redirect(url.format({
        pathname: req.query.state as string,
        query: res.locals.user
    }))
})

export default router