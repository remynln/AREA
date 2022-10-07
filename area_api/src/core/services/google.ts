import { Service } from "../types";
const GoogleStrategy = require("passport-google-oauth20")
import { PubSub } from '@google-cloud/pubsub';
import { readFileSync } from "fs";


async function quickstart(
  projectId = 'your-project-id', // Your Google Cloud Platform project ID
  topicNameOrId = 'my-topic', // Name for the new topic to create
  subscriptionName = 'my-sub' // Name for the new subscription to create
) {
    const file = readFileSync(process.cwd() + process.env.GOOGLE_APPLICATION_CREDENTIALS || '')
    const gmailService = JSON.parse(file.toString())
    console.log(gmailService)
    //// Instantiates a client
    //const pubsub = new PubSub({projectId});
//
    //// Creates a new topic
    //const [topic] = await pubsub.createTopic(topicNameOrId);
    //console.log(`Topic ${topic.name} created.`);
//
    //// Creates a subscription on that new topic
    //const [subscription] = await topic.createSubscription(subscriptionName);
//
    //// Receive callbacks for new messages on the subscription
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
//
    //// Send a message to the topic
    //topic.publish(Buffer.from('Test message!'));
}

const google: Service = {
    start: quickstart,
    actions: new Map(),
    reactions: new Map(),
    strategy: new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/service/google/callback",
      }, function(accessToken: any, refresh_token: any, profile: any, callback: any) {
          console.log(accessToken, refresh_token, profile)
          callback(null, {
              email: profile.emails[0].value
          })
      })
}

export default google