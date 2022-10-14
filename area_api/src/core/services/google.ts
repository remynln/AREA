import { Area, Service } from "../types";
const GoogleStrategy = require("passport-google-oauth20")
import { PubSub } from '@google-cloud/pubsub';
import { readFileSync } from "fs";
import { exit } from "process";
import axios from "axios";
import newMail from "~/areas/gmail/actions/newMail";
import logReaction from "~/areas/console/logReaction";
import sendMail from "~/areas/gmail/reactions/sendMail";
import { Request } from "express";
var Gmail = require("node-gmail-api")
const pubsub = new PubSub({ projectId: "sergify" });

const google: Service = {
    start: () => {
    },
    actions: new Map([
        ["newMail", newMail]
    ]),
    reactions: new Map(),
    strategy: new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        passReqToCallback: true
      }, function(req: any, accessToken: any, refresh_token: any, profile: any, callback: any) {
            const action = google.actions.get("newMail")
            console.log((req as Request).baseUrl)
            if ((req as Request).baseUrl.includes("/auth/")) {
                console.log("this is auth route");
            } else {
                console.log("this is not auth route")
            }
            if (!action)
                return
            let area = new Area(
                action, {},
                sendMail, null, accessToken
            )
            callback(null, {
                email: profile.emails[0].value
            })
      })
}

export default google