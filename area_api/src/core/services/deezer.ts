import { OAuthCallbackObj, Service } from "../types";
import jwt from "jsonwebtoken"
import db from "~/database/db";
import JwtFormat from "~/routes/auth/jwtFormat";
import addedToPlaylist from '~/areas/deezer/action/addedToPlaylist'
import addedToFavorite from '~/areas/deezer/action/addedToFavorite'
import addToPlaylist from '~/areas/deezer/reactions/addToPlaylist'
import addToFavorite from '~/areas/deezer/reactions/addToFavorite'
import createPlaylist from '~/areas/deezer/reactions/createPlaylist'
var DeezerStrategy = require("passport-deezer").Strategy

const deezer: Service = {
    actions: new Map([
        ["addedToPlaylist", addedToPlaylist],
        ["addedToFavorite", addedToFavorite]
    ]),
    reactions: new Map([
        ["addToPlaylist", addToPlaylist],
        ["addToFavorite", addToFavorite],
        ["createPlaylist", createPlaylist]
    ]),
    authParams: {
        accessType: 'offline',
        approvalPrompt: 'force'
    },
    strategy: new DeezerStrategy(
        {
            clientID: process.env.DEEZER_CLIENT_ID,
            clientSecret: process.env.DEEZER_CLIENT_SECRET,
            callbackURL: process.env.DOMAIN + "/service/deezer/callback",
            passReqToCallback: true,
            scope: ["basic_access", "delete_library", "manage_library", "offline_access", "listening_history"]
        },
        (req: any, accessToken: string, refreshToken: string, profile: any, callback: any) => {
            let cbObj: OAuthCallbackObj = {
                data: profile.id.toString(),
                accessToken: accessToken,
                refreshToken: '',
                username: profile.displayName
            }
            let accountToken = req.query.state;
            if (!accountToken || !accountToken.includes(' ')) {
                callback(null, cbObj)
                return
            }
            let mail = (jwt.decode(accountToken.split(' ')[1]) as JwtFormat).email
            db.setToken(accessToken, refreshToken, mail, 'deezer').then(() => {
                callback(null, cbObj)
            }).catch((err) => callback(err))
        }
    ),
    refreshToken: async (refreshToken) => {
        return ''
    }
}

export default deezer