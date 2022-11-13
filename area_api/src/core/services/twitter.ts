import { OAuthCallbackObj, Service } from "../types";
import jwt from "jsonwebtoken"
import db from "~/database/db";
import JwtFormat from "~/routes/auth/jwtFormat";
import { Strategy as TwitterStartegy } from "passport-twitter";
import axios from "axios";
import qs from "qs"
import tweet from "~/areas/twitter/reactions/tweet";
import likeTweet from "~/areas/twitter/reactions/likeTweet";
import newTweet from "~/areas/twitter/actions/newTweet";

const twitter: Service = {
    actions: new Map([
        ["newTweet", newTweet]
    ]),
    reactions: new Map([
        ["tweet", tweet],
        ["likeTweet", likeTweet]
    ]),
    authParams: {
        accessType: 'offline',
        approvalPrompt: 'force',
        stateInQuery: true
    },
    strategy: new TwitterStartegy(
        {
            consumerKey: process.env.TWITTER_CLIENT_ID || '',
            consumerSecret: process.env.TWITTER_CLIENT_SECRET || '',
            callbackURL: process.env.DOMAIN + "/service/twitter/callback",
            passReqToCallback: true,
            includeStatus: true
        },
        (req, accessToken, secretToken, profile, callback) => {
            let cbObj: OAuthCallbackObj = {
                data: profile.id.toString(),
                accessToken: accessToken + " " + secretToken,
                refreshToken: "aaa",
                username: profile.displayName
            }
            let accountToken = req.query.state as string;
            if (!accountToken || !accountToken.includes(' ')) {
                callback(null, cbObj)
                return
            }
            let mail = (jwt.decode(accountToken.split(' ')[1]) as JwtFormat).email
            db.setToken(accessToken + " " + secretToken, "", mail, 'twitter').then(() => {
                callback(null, cbObj)
            }).catch((err) => callback(err))
        }
    ),
    refreshToken: async (refreshToken) => {
        await axios.post("https://api.twitter.com/2/oauth2/token", qs.stringify({
            client_id: process.env.TWITTER_CLIENT_ID,
            grant_type: "refresh_token",
            refresh_token: refreshToken
        }), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
        return ''
    }
}

export default twitter