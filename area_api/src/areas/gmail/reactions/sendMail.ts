import { AreaRet, Reaction } from "~/core/types";
import { createMimeMessage, MailLocation } from "mimetext";
import axios, { AxiosError } from "axios";
import { getMailFromToken } from "../utils";

const sendMail: Reaction = {
    serviceName: 'google',
    description: "Send a mail from the gmail's mailbox",
    name: "sendMail",
    paramTypes: {
        'recipient': 'string',
        'object': 'string',
        'body': 'string'
    },
    async launch(params, token, refresh) {
        console.log("sending mail...")
        const msg = createMimeMessage()
        let mail: string = await refresh(async () => {
            try {
                let newMail = await getMailFromToken(token);
                return newMail
            } catch (e: any) {
                if (!e.response)
                    throw e
                let err = e as AxiosError
                if (err.response?.status == 401)
                    return AreaRet.AccessTokenExpired
                else
                    throw e
            }
        })
        msg.setSender({name: 'Marco', addr: mail})
        msg.setRecipient(params.recipient)
        msg.setSubject(params.object)
        msg.setMessage('text/plain', params.body)
        refresh(async () => {
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
        })
    }
}

export default sendMail