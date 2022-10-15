import { Action } from "~/core/types";
import { PubSub } from '@google-cloud/pubsub';
import axios from "axios";
const pubsub = new PubSub({ projectId: "sergify" });

const TOPIC_NAME = "my-topic"
const SUBSCRIPTION_NAME = "my-sub"

interface None {

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

async function getMailFromId(token: string,
    mailId: string,
    trigger: (mail: Mail) => void
) {
    const res = await axios.get(`https://gmail.googleapis.com/gmail/v1/users/me/messages/` + mailId, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    })
    console.log("labels:", res.data.labelIds)
    for (let i of res.data.labelIds) {
        console.log("yes", i)
        if (i == 'SENT')
            return
    }
    let from: string[] = (res.data.payload.headers as any[])
        .find(({ name }) => name == "From")
        .value.split('<')
    console.log("from", (res.data.payload.headers as any[])
        .find(({ name }) => name == "From"))
    let to: string[] = (res.data.payload.headers as any[])
        .find(({ name }) => name == "To")
        .value.split('<')
    console.log("to", (res.data.payload.headers as any[])
        .find(({ name }) => name == "To"))
    let mail: Mail = {
        from: {
            name: from.length == 2 ? from[0].trim() : '',
            email: from.length == 2 ? (from[1] as string).replace('>', '') : from[0]
        },
        to: {
            name: to.length == 2 ? to[0].trim() : '',
            email: to.length == 2 ? (to[1] as string).replace('>', '') : to[0]
        },
        object: (res.data.payload.headers as any[])
            .find(({ name }) => name == "Subject")
            .value,
        date: (res.data.payload.headers as any[])
            .find(({ name }) => name == "Date")
            .value,
        body: atob(res.data.payload.parts[0].body.data)
    }
    trigger(mail)
}

async function getLastMails(
    token: string,
    historyId: string,
    trigger: (mail: Mail) => void
) {
    const res = await axios.get("https://gmail.googleapis.com/gmail/v1/users/me/history", {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        params: {
            startHistoryId: historyId
        }
    })
    console.log(res.data)
    if (!res.data.history)
        return
    for (let i of res.data.history) {
        if (!i.messagesAdded)
            continue;
        for (let messagesAdded of i.messagesAdded) {
            await getMailFromId(token, messagesAdded.message.id, trigger)
        }
    }
}

async function topicSubscribe(token: string, trigger: (historyId: number) => void) {
    console.log("starting action newMail...")
    const topic = pubsub.topic(TOPIC_NAME)
    const sub = topic.subscription(SUBSCRIPTION_NAME);
    await sub.delete()
    const [subscription] = await topic.createSubscription(SUBSCRIPTION_NAME);

    const res = await axios.post("https://www.googleapis.com/gmail/v1/users/me/watch", {
        topicName: topic.name,
        labelIds: ["INBOX"],
    }, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    })
    var historyId = res.data.historyId
    sub.on('message', (mess) => {
        trigger(historyId)
        historyId = JSON.parse(mess.data).historyId
    })
    console.log("start success !")
    return res;
}

const newMail: Action<None, Mail> = {
    start(trigger, params, serviceToken) {
        topicSubscribe(serviceToken, (historyId) => {
            getLastMails(serviceToken, historyId.toString(), trigger)
        })
    },
    stop() {
    },
    destroy() {

    }
}

export default newMail