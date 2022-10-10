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
    let from: string[] = (res.data.payload.headers as any[])
        .find(({ name }) => name == "From")
        .value.split('<')
    let to: string[] = (res.data.payload.headers as any[])
        .find(({ name }) => name == "To")
        .value.split('<')
    let mail: Mail = {
        from: {
            name: from[0].trim(),
            email: (from[1] as string).replace('>', '')
        },
        to: {
            name: to[0].trim(),
            email: to[1].replace('<', '').replace('>', '')
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
    for (let i of res.data.history) {
        if (!i.messagesAdded)
            continue;
        for (let messagesAdded of i.messagesAdded) {
            await getMailFromId(token, messagesAdded.message.id, trigger)
        }
    }
}

async function topicSubscribe(token: string, trigger: (historyId: number) => void) {
    const topic = pubsub.topic(TOPIC_NAME)
    const sub = topic.subscription(SUBSCRIPTION_NAME);
    await sub.delete()
    const [subscription] = await topic.createSubscription(SUBSCRIPTION_NAME);

    console.log("starting action newMail...")
    const res = await axios.post("https://www.googleapis.com/gmail/v1/users/me/watch", {
        topicName: topic.name,
        labelIds: ["INBOX"],
    }, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    })
    sub.on('message', (mess) => {
        trigger(res.data.historyId)
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