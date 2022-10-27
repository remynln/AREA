import { Action, AreaRet } from "~/core/types";
import { PubSub, Subscription } from '@google-cloud/pubsub';
import axios from "axios";
const pubsub = new PubSub({ projectId: "sergify" });

const TOPIC_NAME = "my-topic"
const SUBSCRIPTION_NAME = "my-sub"

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
    for (let i of res.data.labelIds) {
        if (i == 'SENT')
            return
    }
    let from: string[] = (res.data.payload.headers as any[])
        .find(({ name }) => name == "From")
        .value.split('<')
    let to: string[] = (res.data.payload.headers as any[])
        .find(({ name }) => name == "To")
        .value.split('<')
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
    var newHistoryId = historyId
    const res = await axios.get("https://gmail.googleapis.com/gmail/v1/users/me/history", {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        params: {
            startHistoryId: historyId
        }
    })
    if (!res.data.history)
        return
    for (let i of res.data.history) {
        if (!i.messagesAdded)
            continue;
        for (let messagesAdded of i.messagesAdded) {
            await getMailFromId(token, messagesAdded.message.id, trigger)
        }
    }
    newHistoryId = res.data.historyId;
    return newHistoryId
}

async function topicSubscribe(token: string, trigger: (historyId: number) => Promise<void>, accMail: string) {
    console.log("starting action newMail...")
    const topic = pubsub.topic(TOPIC_NAME)
    let subName = "sub-" + accMail.replace("@", '-')
    const sub = topic.subscription(subName);
    if (!(await sub.exists())[0]) {
        await topic.createSubscription(subName);
    }

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

interface Mail2 {
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

interface Sub {
    historyId: string
    ref: Subscription
}

const newMail: Action = {
    description: "When a new mail is received in the gmail mailbox",
    serviceName: 'google',
    paramTypes: {},
    propertiesType: {
        'from': {
            'name': 'string',
            'email': 'string'
        },
        'to': {
            'name': 'string',
            'email': 'string'
        },
        'object': 'string',
        'body': 'string',
        'date': 'string'
    },
    subs: [] as Sub[],
    async start(trigger, params, serviceToken, accountMail) {
        var globalhistoryId: string | undefined = undefined
        try {
            let res = await topicSubscribe(serviceToken, async (historyId) => {
                if (!globalhistoryId)
                    globalhistoryId = historyId.toString()
                globalhistoryId = await getLastMails(serviceToken, globalhistoryId, trigger)
            }, accountMail)
        } catch (err: any) {
            if (!err.response) {
                console.log(err)
            }
            if (err.response.status == 401) {
                return AreaRet.AccessTokenExpired
            }
        }
        return AreaRet.Ok
    },
    stop() {
    },
    destroy() {

    }
}

export default newMail