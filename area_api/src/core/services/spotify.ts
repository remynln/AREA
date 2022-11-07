import { OAuthCallbackObj, Service } from "../types";
import jwt from "jsonwebtoken"
import db from "~/database/db";
import JwtFormat from "~/routes/auth/jwtFormat";
import axios from "axios";
import process from "process";
var SpotifyStrategy = require("passport-spotify").Strategy

const spotify: Service = {
    actions: new Map([]),
    reactions: new Map([]),
    authParams: {
        accessType: 'offline',
        approvalPrompt: 'force'
    },
    strategy: new SpotifyStrategy(
        {
            clientID: process.env.SPOTIFY_CLIENT_ID,
            clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
            callbackURL: "http://localhost:8080/service/spotify/callback",
            passReqToCallback: true,
            scope: [
                "playlist-read-private",
                "playlist-read-collaborative",
                "playlist-modify-private",
                "playlist-modify-public",
                "user-follow-modify",
                "user-follow-read",
                "user-library-modify",
                "user-library-read"
            ]
        },
        (req: any, accessToken: string, refreshToken: string, profile: any, callback: any) => {
            let cbObj: OAuthCallbackObj = {
                data: profile.id.toString(),
                accessToken: accessToken,
                refreshToken: refreshToken,
                username: profile.displayName
            }
            console.log(cbObj)
            let accountToken = req.query.state;
            if (!accountToken || !accountToken.includes(' ')) {
                callback(null, cbObj)
                return
            }
            let mail = (jwt.decode(accountToken.split(' ')[1]) as JwtFormat).email
            db.setToken(accessToken, refreshToken, mail, 'spotify').then(() => {
                callback(null, cbObj)
            })
        }
    ),
    refreshToken: async (refreshToken) => {
        let res = await axios.post("https://accounts.spotify.com/api/token", {
            "grant_type": 'refresh_token',
            "refresh_token": refreshToken
        }, {
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                "Authorization": 'Basic ' + btoa(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET)
            }
        })
        if (!res.data.access_token)
            return null
        return res.data.access_token
    }
}

export default spotify