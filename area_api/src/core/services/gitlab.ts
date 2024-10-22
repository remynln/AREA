import { OAuthCallbackObj, Service } from "../types";
import jwt from "jsonwebtoken"
import db from "~/database/db";
import JwtFormat from "~/routes/auth/jwtFormat";
import axios from "axios";

import addStar from '~/areas/gitlab/reactions/addStar'
import removeStar from '~/areas/gitlab/reactions/removeStar'
import fork from '~/areas/gitlab/reactions/fork'
import edit from '~/areas/gitlab/reactions/edit'
import newStar from '~/areas/gitlab/actions/newStar'
import starRemoved from '~/areas/gitlab/actions/starRemoved'
import projectUpdated from '~/areas/gitlab/actions/projectUpdated'
var GitlabStrategy = require("passport-gitlab2").Strategy

const gitlab: Service = {
    actions: new Map([
        ["newStar", newStar],
        ["starRemoved", starRemoved],
        ["projectUpdated", projectUpdated]
    ]),
    reactions: new Map([
        ["addStar", addStar],
        ["removeStar", removeStar],
        ["fork", fork],
        ["edit", edit]
    ]),
    authParams: {
        accessType: 'offline',
        approvalPrompt: 'force'
    },
    strategy: new GitlabStrategy(
        {
            clientID: process.env.GITLAB_CLIENT_ID,
            clientSecret: process.env.GITLAB_CLIENT_SECRET,
            callbackURL: process.env.DOMAIN + "/service/gitlab/callback",
            passReqToCallback: true,
            scope: ["api"]
        },
        (req: any, accessToken: string, refreshToken: string, profile: any, callback: any) => {
            let cbObj: OAuthCallbackObj = {
                data: profile,
                accessToken: accessToken,
                refreshToken: refreshToken,
                username: profile.displayName
            }
            let accountToken = req.query.state;
            if (!accountToken || !accountToken.includes(' ')) {
                callback(null, cbObj)
                return
            }
            let mail = (jwt.decode(accountToken.split(' ')[1]) as JwtFormat).email
            db.setToken(accessToken, refreshToken, mail, 'gitlab').then(() => {
                callback(null, cbObj)
            }).catch((err) => callback(err))
        }
    ),
    refreshToken: async (refreshToken) => {
        let res
        try {
            console.log("ref", refreshToken)
            res = await axios.post("https://github.com/login/oauth/access_token", new URLSearchParams({
                refresh_token: refreshToken,
                grant_type: 'refresh_token',
                client_id: process.env.GITLAB_CLIENT_ID || '',
                client_secret: process.env.GITLAB_CLIENT_SECRET || ''
            }))
            console.log(res)
            if (!res.data.access_token)
                return null
            return res.data.access_token
        } catch (err: any) {
            if (err.response && err.response.status == 401)
                return null
            throw err
        }
    }
}

export default gitlab