import axios from "axios";
import { OAuth } from "oauth";
import { AreaRet, Reaction, ReactionConfig } from "~/core/types"

export var SkyrockOauth = new OAuth(
    "",
    "",
    process.env.SKYROCK_CLIENT_ID || '',
    process.env.SKYROCK_CLIENT_SECRET || '',
    "1.0",
    null,
    "HMAC-SHA1"
)

class addPost extends Reaction {
    override async launch(): Promise<void> {
        let [token, secret] = this.token.split(' ')
        let res = await axios.post(`https://api.skyrock.com/v2/blog/new_post.json`, {
            title: this.params.title,
            text: this.params.body
        }, {
            headers: {
                "Content-type": "application/json",
                "Authorization": SkyrockOauth.authHeader(
                    "https://api.skyrock.com/v2/blog/new_post.json",
                    token, secret,
                    "POST"
                )
            }
        })
    }
}

let config: ReactionConfig = {
    serviceName: "skyrock",
    name: "addPost",
    description: "Add a new post to your skyblog",
    paramTypes: {
        title: "string",
        body: "string",
    },
    create: addPost
}

export default config