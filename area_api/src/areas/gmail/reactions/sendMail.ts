import { AreaRet, Reaction } from "~/core/types";
import { createMimeMessage, MailLocation } from "mimetext";
import axios from "axios";


async function getMailFromToken(token: string) {
    var res = await axios.get("https://gmail.googleapis.com/gmail/v1/users/me/profile", {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    })
    return res.data.emailAddress
}

const sendMail: Reaction = {
    serviceName: 'google',
    description: "Send a mail from the gmail's mailbox",
    paramTypes: {
        'recipient': 'string',
        'object': 'string',
        'body': 'string'
    },
    async launch(params, token) {
        const msg = createMimeMessage()
        let mail: string
        try {
            mail = await getMailFromToken(token);
        } catch (e) {
            throw Error("Can't get sender mail")
        }
        msg.setSender({name: 'Marco', addr: mail})
        msg.setRecipient(params.recipient)
        msg.setSubject(params.object)
        msg.setMessage('text/plain', params.body)
        console.log(msg)
        console.log(msg.asEncoded())
        try {
            await axios.post("https://gmail.googleapis.com/upload/gmail/v1/users/me/messages/send",
                msg.asRaw(), {
                headers: {
                    'Content-Type': 'message/rfc822',
                    'Authorization': 'Bearer ' + token
                }
            })
        } catch (err: any) {
            if (err.response.status == 401) {
                return AreaRet.AccessTokenExpired
            }
            throw err
        }
        return AreaRet.Ok
    }
}

export default sendMail