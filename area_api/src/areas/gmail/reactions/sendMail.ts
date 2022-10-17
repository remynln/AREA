import { Reaction } from "~/core/types";
import { createMimeMessage } from "mimetext";
import axios from "axios";


const sendMail: Reaction = {
    paramTypes: {},
    launch(params, token) {
        const msg = createMimeMessage()
        msg.setSender({name: 'Marco', addr: 'marco.leaguelegends@gmail.com'})
        msg.setRecipient('marco.reguillot@epitech.eu')
        msg.setSubject("let's goo")
        msg.setMessage('text/plain', `Hi, I'm a simple text.`)
        console.log(msg)
        console.log(msg.asEncoded())

        axios.post("https://gmail.googleapis.com/upload/gmail/v1/users/me/messages/send",
            msg.asRaw(), {
            headers: {
                'Content-Type': 'message/rfc822',
                'Authorization': 'Bearer ' + token
            }
        }).then((res) => {
            console.log("yes !")
        }).catch((err) => {
            console.log(err.response)
        })
    }
}

export default sendMail