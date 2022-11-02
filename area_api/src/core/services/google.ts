import { Area, Service } from "../types";
const GoogleStrategy = require("passport-google-oauth20")
import { PubSub } from '@google-cloud/pubsub';
import { readFileSync } from "fs";
import { exit } from "process";
import axios from "axios";
import newMail from "~/areas/gmail/actions/newMail";
import sendMail from "~/areas/gmail/reactions/sendMail";
import { Request } from "express";
import db from "~/database/db";
import JwtFormat from "~/routes/auth/jwtFormat";
var Gmail = require("node-gmail-api")
import jwt from "jsonwebtoken"
const pubsub = new PubSub({ projectId: "sergify" });
import qs from "qs"

const google: Service = {
    refreshToken: async (it: string) => {
        let res
        res = await axios.post("https://oauth2.googleapis.com/token", qs.stringify({
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            grant_type: "refresh_token",
            refresh_token: it
        }), {
            headers: {
                'content-type': 'application/x-www-form-urlencoded'
            }
        })
        return res.data.access_token;
    },
    actions: new Map([
        ["newMail", newMail]
    ]),
    reactions: new Map([
        ["sendMail", sendMail]
    ]),
    authParams: {
        accessType: 'offline',
        approvalPrompt: 'force',
    },
    strategy: new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        passReqToCallback: true,
        scope: ['profile', 'email',
            'https://mail.google.com/']
        }, function(req: any, accessToken: any, refresh_token: any, profile: any, callback: any) {
            console.log((req as Request).baseUrl)
            console.log(profile)
            let accountToken = req.query.state;
            let cbObj = {
                data: profile._json.email,
                username: profile._json.name,
                refreshToken: refresh_token,
                accessToken: accessToken
            }
            if (!accountToken) {
                callback(null, cbObj)
                return
            }
            let mail = (jwt.decode(accountToken.split(' ')[1]) as JwtFormat).email
            if (!(req as Request).baseUrl.includes("/auth/")) {
                db.setToken(accessToken, refresh_token, mail, 'google').then(() => {
                    callback(null, cbObj)
                })
            } else {
                callback(cbObj)
            }
      })
}

export default google