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

interface Mail {
    from: {
        name: string,
        email: string
    }
    to: {
        name: string,
        email: string
    }
    object: string,
    body: string,
    date: string
}

function getMailFromId(token: string, mailId: string) {
    axios.get(`https://gmail.googleapis.com/gmail/v1/users/me/messages/` + mailId, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    }).then((res) => {
        console.log("new mail !");
        let from = (res.data.payload.headers as any[])
            .find(({ name }) => name == "From")
            .value.split(' ')
        let to = (res.data.payload.headers as any[])
            .find(({ name }) => name == "To")
            .value.split(' ')
        let mail: Mail = {
            from: {
                name: from[0],
                email: from[1]
            },
            to: {
                name: to[0],
                email: to[1]
            },
            object: (res.data.payload.headers as any[])
                .find(({ name }) => name == "Subject")
                .value,
            date: (res.data.payload.headers as any[])
                .find(({ name }) => name == "Date")
                .value,
            body: atob(res.data.payload.parts[0].body.data)
        }
        console.log("new mail !", mail);
    }).catch((err) => {
        console.log("errrre", err)
    })
}

function getLastMail(token: string, historyId: string) {
    axios.get("https://gmail.googleapis.com/gmail/v1/users/me/history", {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        params: {
            startHistoryId: historyId
        }
    }).then((res) => {
        for (let i of res.data.history) {
            if (!i.messagesAdded)
                continue;
            for (let messagesAdded of i.messagesAdded) {
                getMailFromId(token, messagesAdded.message.id)
            }
        } 
    }).catch((err) => {
        console.log("errrr", err.response)
    })
}

async function topicConnection(
    token: string,
    topicNameOrId = 'my-topic',
    subscriptionName = 'my-sub'
) {
    const topic = pubsub.topic(topicNameOrId)
    const sub = topic.subscription(subscriptionName);
    await sub.delete()
    const [subscription] = await topic.createSubscription(subscriptionName);

    console.log(topic.name)
    axios.post("https://www.googleapis.com/gmail/v1/users/me/watch", {
        topicName: topic.name,
        labelIds: ["INBOX"],
    }, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    }).then((res) => {
        console.log("post success", res.data)
        const startHistoryId = res.data.historyId
        sub.on('message', (mess) => {
            console.log("new message:", JSON.parse(mess.data))
            let { historyId } = JSON.parse(mess.data)
            console.log("new messageeee:", startHistoryId.toString())
            getLastMail(token, startHistoryId.toString())
        })
        sub.on('error', (err) => {
            console.log("ggl service error", err)
            exit(1)
        })
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