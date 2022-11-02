import { AreaRet, Reaction } from "~/core/types";
import axios, { AxiosError } from "axios";
import { createMimeMessage } from "mimetext";
import { getMailFromToken, getUserFromToken } from "~/areas/outlook/utils";
import { use } from "passport";

const sendMail: Reaction = {
    serviceName: 'outlook',
    description: "Send a mail from the outlook's mailbox",
    name: "sendMail",
    paramTypes: {
        'recipient': 'string',
        'object': 'string',
        'body': 'string'
    },
    async launch(params, token) {
        console.log("sending mail...")
        const msg = createMimeMessage()
        let mail: string
        let user: string
        try {
            mail = await getMailFromToken(token)
            user = await getUserFromToken(token)
            console.log(mail)
        } catch (e: any) {
            if (!e.response)
                throw e
            let err = e as AxiosError
            if (err.response?.status == 401)
                return AreaRet.AccessTokenExpired
            else
                throw e
        }
        msg.setSender({name: user, addr: mail})
        msg.setRecipient(params.recipient)  
        msg.setSubject(params.object)
        msg.setMessage('text/plain', params.body)
        console.log(msg)
        console.log(msg.asEncoded())
        try {
            await axios.post("https://graph.microsoft.com/v1.0/me/sendMail",
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