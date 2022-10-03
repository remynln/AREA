import passport, { Strategy } from "passport";
import express, { Request, Response, Router } from "express";
const GoogleStrategy = require("passport-google-oidc")
import "dotenv/config"

var router: Router = express.Router()

const strat = (callbackUrl: string): Strategy => new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: callbackUrl,
  scope: ['profile']
}, (issuer: any, profile: any, callback: any) => {
    callback(null, {
        name: "Charles-Rachid"
    })
})

router.get('/google', (req, res, next) => {
    console.log("azezea", req.query.callback)
    
    const callbackUrl: string = req.query.callback as string || ''
    if (callbackUrl == "") {
        res.status(403).json({
            message: "No callback url"
        })
        return;
    }
    return passport.authenticate(strat(callbackUrl))(req, res, next)
});

export default router