import { Area, Service } from "../types";
const OutlookStrategy = require("passport-outlook")
import { readFileSync } from "fs";
import { exit } from "process";
import axios from "axios";
// import newMail from "~/areas/outlook/actions/newMail";
import sendMail from "~/areas/outlook/reactions/sendMail";
import { Request } from "express";
import db from "~/database/db";
import JwtFormat from "~/routes/auth/jwtFormat";
import jwt from "jsonwebtoken"
import qs from "qs"

const outlook: Service = {
    refreshToken: async (it: string) => {
        let res
        res = await axios.post("https://login.microsoftonline.com/common/oauth2/v2.0/token", qs.stringify({
            client_id: process.env.MICROSOFT_CLIENT_ID,
            client_secret: process.env.MICROSOFT_CLIENT_SECRET,
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
        // ["newMail", newMail]
    ]),
    reactions: new Map([
        ["sendMail", sendMail]
    ]),
    authParams: {
    },
    strategy: new OutlookStrategy({
        clientID: process.env.MICROSOFT_CLIENT_ID,
        clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
        passReqToCallback: true,
        scope: [
            'openid',
            'profile',
            'offline_access',
            'https://outlook.office.com/Mail.Read',
            'https://outlook.office.com/Mail.Send'
        ],
        }, function(req: any, accessToken: any, refresh_token: any, profile: any, callback: any) {
            // console.log((req as Request).baseUrl)
            console.log(profile)
            let accountToken = req.headers.authorization;
            let cbObj = {
                data: profile._json.EmailAddress,
                username: profile._json.DisplayName,
                refreshToken: refresh_token,
                accessToken: accessToken
            }
            if (!accountToken) {
                callback(null, cbObj, null)
                return
            }
            let mail = (jwt.decode(accountToken.split(' ')[1]) as JwtFormat).email
            if (!(req as Request).baseUrl.includes("/auth/")) {
                db.setToken(accessToken, refresh_token, mail, 'outlook').then(() => {
                    callback(null, cbObj, null)
                })
            } else {
                callback(null, cbObj, null)
            }
      })
}

export default outlook