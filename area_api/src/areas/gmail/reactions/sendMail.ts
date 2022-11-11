import { AreaRet, Reaction, ReactionConfig } from "~/core/types";
import { createMimeMessage, MailLocation } from "mimetext";
import axios, { AxiosError } from "axios";
import { getMailFromToken } from "../utils";

class sendMail extends Reaction {
    override async launch() {
        console.log("sending mail...")
        const msg = createMimeMessage()
        let mail: string = await this.refresh(async () => {
            try {
                let newMail = await getMailFromToken(this.token);
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
        msg.setRecipient(this.params.recipient)
        msg.setSubject(this.params.object)
        msg.setMessage('text/plain', this.params.body)
        await this.refresh(async () => {
            try {
                await axios.post("https://gmail.googleapis.com/upload/gmail/v1/users/me/messages/send",
                    msg.asRaw(), {
                    headers: {
                        'Content-Type': 'message/rfc822',
                        'Authorization': 'Bearer ' + this.token
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
let config: ReactionConfig = {
    serviceName: 'google',
    description: "Send a mail from the gmail's mailbox",
    name: "sendMail",
    paramTypes: {
        'recipient': 'string',
        'object': 'string',
        'body': 'string'
    },
    create: sendMail
}

export default config