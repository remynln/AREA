import { Action, AreaRet, RefreshTokenFunction } from "~/core/types";
import { PubSub, Subscription } from '@google-cloud/pubsub';
import axios, { AxiosError, AxiosResponse } from "axios";
import { getMailFromToken } from "../utils";
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
    trigger: (mail: Mail) => void,
    refresh: RefreshTokenFunction
) {
    const res = await refresh(async () => {
        try {
            return await axios.get(`https://gmail.googleapis.com/gmail/v1/users/me/messages/` + mailId, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            })
        } catch (err: any) {
            if (!err.response || err.response.status != 401)
                throw err
            return AreaRet.AccessTokenExpired
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
    refresh: RefreshTokenFunction,
    trigger: (mail: Mail) => void
) {
    var newHistoryId = historyId
    const res: AxiosResponse = await refresh(async () => {
        try {
            const res = await axios.get("https://gmail.googleapis.com/gmail/v1/users/me/history", {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                params: {
                    startHistoryId: historyId
                }
            })
            return res
        } catch (err: any) {
            if (!err.response)
                throw err
            if (err.response.status == 401)
                return AreaRet.AccessTokenExpired
            throw err
        }
    })
    if (!res.data.history)
        return historyId
    for (let i of res.data.history) {
        if (!i.messagesAdded)
            continue;
        for (let messagesAdded of i.messagesAdded) {
            await getMailFromId(token, messagesAdded.message.id, trigger, refresh)
        }
    }
    newHistoryId = res.data.historyId;
    return newHistoryId
}

async function initSub() {
    const topic = pubsub.topic(TOPIC_NAME)
    let subName = "gmail-sub" //"sub-" + accMail.replace("@", '-')
    const sub = topic.subscription(subName);
    if ((await sub.exists())[0]) {
        await sub.delete()
    }
    await topic.createSubscription(subName);
    return sub;
}

async function watchForMail(token: string) {
    const res = await axios.post("https://www.googleapis.com/gmail/v1/users/me/watch", {
        topicName: pubsub.topic(TOPIC_NAME).name,
        labelIds: ["INBOX"],
    }, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    })
    return res.data.historyId.toString() as string
    
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
    historyId: string,
    token: string,
    triggers: ((properties: any) => void)[]
    email: string
}

interface NewMail extends Action {
    subs: Map<string, Sub> | undefined,
    _sub: Subscription | undefined,
    _newMessageCallback: (mess: any, refresh: RefreshTokenFunction) => Promise<void>
}

const newMail: NewMail = {
    description: "When a new mail is received in the gmail mailbox",
    serviceName: 'google',
    name: 'newMail',
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
    subs: undefined,
    _sub: undefined,

    async _newMessageCallback(mess, refresh) {
        console.log("received !")
        if (!this.subs) {
            console.log("subs undefined")
            return
        }
        let data = JSON.parse(mess.data)
        console.log("haaa ha")
        for (let [key, value] of this.subs) {
            if (data.emailAddress != value.email)
                continue;
            value.historyId = await getLastMails(value.token, value.historyId, refresh, (mail) => {
                for (let i of value.triggers) {
                    i(mail)
                }
            })
        }
    },

    async start(params, serviceToken, accountMail, trigger, refresh, error) {
        if (!this.subs)
            this.subs = new Map([])
        console.log("initializing sub")
        if (!this._sub) {
            this._sub = await initSub()
            this._sub.on('message', (mess) => {
                this._newMessageCallback(mess, refresh).catch((err) => {
                    error(err as Error)
                })
            })
        }
        console.log("getting account info")
        var sub = this.subs.get(accountMail)
        if (!sub) {
            var historyId: string = ''
            var email: string = ''
            await refresh(async () => {
                try {
                    historyId = await watchForMail(serviceToken)
                    email = await getMailFromToken(serviceToken)
                } catch (err: any) {
                    if (!err.response) {
                        throw err
                    }
                    if ((err as AxiosError).response?.status == 401) {
                        return AreaRet.AccessTokenExpired
                    }
                    throw err
                }
                return AreaRet.Ok
            })
            sub = {
                historyId: historyId,
                token: serviceToken,
                triggers: [],
                email: email
            }
            this.subs.set(accountMail, sub)
        }
        console.log("done")
        sub.triggers.push(trigger)
    },
    stop() {
    },
    destroy() {

    }
}

export default newMail