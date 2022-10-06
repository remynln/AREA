import { Service } from "../types";
const GoogleStrategy = require("passport-google-oauth20")

const google: Service = {
    actions: new Map(),
    reactions: new Map(),
    strategy: new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:8080/auth/service/google/callback",
      }, function(accessToken: any, refresh_token: any, profile: any, callback: any) {
          console.log(accessToken, refresh_token, profile)
          callback(null, {
              email: profile.emails[0].value
          })
      })
}

export default google