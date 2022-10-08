import { Service } from "../types";
const GoogleStrategy = require("passport-google-oauth20")
import { PubSub } from '@google-cloud/pubsub';
import { readFileSync } from "fs";
import { exit } from "process";
import axios from "axios";
var Gmail = require("node-gmail-api")
const pubsub = new PubSub({ projectId: "sergify" });

async function createTopic(
  //projectId = 'your-project-id', // Your Google Cloud Platform project ID
  topicNameOrId = 'my-topic', // Name for the new topic to create
  subscriptionName = 'my-sub' // Name for the new subscription to create
) {
    // Creates a new topic
    const [topic] = await pubsub.createTopic(topicNameOrId);
    console.log(`Topic ${topic.name} created.`);

    // Creates a subscription on that new topic
    const [subscription] = await topic.createSubscription(subscriptionName);
//
    // Receive callbacks for new messages on the subscription
    //subscription.on('message', message => {
    //  console.log('Received message:', message.data.toString());
    //  process.exit(0);
    //});
//
    //// Receive callbacks for errors on the subscription
    //subscription.on('error', error => {
    //  console.error('Received error:', error);
    //  process.exit(1);
    //});

    // Send a message to the topic
    //topic.publish(Buffer.from('Test message!'));
}

function topicConnection(
    token: string,
    topicNameOrId = 'my-topic',
    subscriptionName = 'my-sub'
) {
    const topic = pubsub.topic(topicNameOrId)
    const sub = topic.subscription(subscriptionName);
    //sub.on('message', (mess) => {
    //    console.log("new message:", mess.data.toString())
    //})
    //sub.on('error', (err) => {
    //    console.log("ggl service error", err)
    //    exit(1)
    //})
    console.log(topic.name)
    axios.post("https://www.googleapis.com/gmail/v1/users/me/watch", {
        topicName: topic.name,
        labelIds: ["INBOX"]
    }, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    }).then((res) => {
        console.log("post success", res.data)
    }).catch((err) => {
        console.log("post error:", err.response)
    })
}

const google: Service = {
    start: () => {
    },
    actions: new Map(),
    reactions: new Map(),
    strategy: new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/service/google/callback",
        scope: ['profile', 'email',
            'https://mail.google.com/']
      }, function(accessToken: any, refresh_token: any, profile: any, callback: any) {
          console.log(accessToken, refresh_token, profile)
          topicConnection(accessToken)
          callback(null, {
              email: profile.emails[0].value
          })
      })
}

export default google