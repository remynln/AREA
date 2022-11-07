import { Service } from "../types";
const MicrosoftStrategy = require("passport-microsoft").Strategy;
import { readFileSync } from "fs";
import { exit } from "process";
import axios from "axios";
import { Request } from "express";
import db from "~/database/db";
import JwtFormat from "~/routes/auth/jwtFormat";
import jwt from "jsonwebtoken"
import qs from "qs"

const microsoft: Service = {
    refreshToken: async (it: string) => {
        let res
        try {
            console.log("AAAAA")
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
        } catch (err: any) {
            if (err.response && err.response.status == 400)
                return null
            throw err
        }
    },
    actions: new Map([
    ]),
    reactions: new Map([
    ]),
    authParams: {
        accessType: 'offline',
        approvalPrompt: 'force',
    },
    strategy: new MicrosoftStrategy({
        clientID: process.env.MICROSOFT_CLIENT_ID,
        clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
        passReqToCallback: true,
        scope: [
            'https://graph.microsoft.com/.default',
            'https://graph.microsoft.com/User.Read'
        ]
        }, function(req: any, accessToken: any, refresh_token: any, profile: any, callback: any) {
            console.log("AAAAA" )
            let accountToken = req.query.state;
            let cbObj = {
                data: profile._json.email,
                username: profile._json.name,
                refreshToken: refresh_token,
                accessToken: accessToken
            }
            if (!accountToken || !accountToken.includes(' ')) {
                callback(null, cbObj)
                return
            }
            let mail = (jwt.decode(accountToken.split(' ')[1]) as JwtFormat).email
            db.setToken(accessToken, refresh_token, mail, 'microsoft').then(() => {
                callback(null, cbObj)
            })
            
      })
}

export default microsoft

// import { Area, Service } from "../types";
// const MicrosoftStrategy = require("passport-microsoft").Strategy
// import { readFileSync } from "fs";
// import { exit } from "process";
// import axios from "axios";
// // import newMail from "~/areas/microsoft/actions/newMail";
// import sendMail from "~/areas/microsoft/reactions/sendMail";
// import { Request } from "express";
// import db from "~/database/db";
// import JwtFormat from "~/routes/auth/jwtFormat";
// import jwt from "jsonwebtoken"
// import qs from "qs"

// const Microsoft: Service = {
//     refreshToken: async (it: string) => {
//         let res
//         res = await axios.post("https://login.microsoftonline.com/common/oauth2/v2.0/token", qs.stringify({
//             client_id: process.env.MICROSOFT_CLIENT_ID,
//             client_secret: process.env.MICROSOFT_CLIENT_SECRET,
//             grant_type: "refresh_token",
//             refresh_token: it
//         }), {
//             headers: {
//                 'content-type': 'application/x-www-form-urlencoded'
//             }
//         })
//         return res.data.access_token;
//     },
//     actions: new Map([
//         // ["newMail", newMail]
//     ]),
//     reactions: new Map([
//         ["sendMail", sendMail]
//     ]),
//     authParams: {
//     },
//     strategy: new MicrosoftStrategy({
//         clientID: process.env.MICROSOFT_CLIENT_ID,
//         clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
//         passReqToCallback: true,
//         scope: [
//             'openid',
//             'profile',
//             'offline_access',
//             'https://outlook.office.com/Mail.Read',
//             'https://outlook.office.com/Mail.Send'
//         ],
//         }, function(req: any, accessToken: any, refresh_token: any, profile: any, callback: any) {
//             // console.log((req as Request).baseUrl)
//             console.log(profile)
//             let accountToken = req.headers.authorization;
//             let cbObj = {
//                 data: profile._json.EmailAddress,
//                 username: profile._json.DisplayName,
//                 refreshToken: refresh_token,
//                 accessToken: accessToken
//             }
//             if (!accountToken) {
//                 callback(null, cbObj, null)
//                 return
//             }
//             let mail = (jwt.decode(accountToken.split(' ')[1]) as JwtFormat).email
//             if (!(req as Request).baseUrl.includes("/auth/")) {
//                 db.setToken(accessToken, refresh_token, mail, 'microsoft').then(() => {
//                     callback(null, cbObj, null)
//                 })
//             } else {
//                 callback(null, cbObj, null)
//             }
//       })
// }

// export default Microsoft