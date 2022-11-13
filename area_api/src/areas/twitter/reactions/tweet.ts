import axios from "axios";
import { Reaction, ReactionConfig } from "~/core/types";
import { OAuth } from "oauth"

export var TwitterOauth = new OAuth(
    'https://api.twitter.com/oauth/request_token',
    'https://api.twitter.com/oauth/access_token',
    process.env.TWITTER_CLIENT_ID || '',
    process.env.TWITTER_CLIENT_SECRET || '',
    '1.0A',
    null,
    'HMAC-SHA1'
)

class tweet extends Reaction {
    override async launch(): Promise<void> {
        let [token, secret] = this.token.split(' ')
        let header = TwitterOauth.authHeader(
            "https://api.twitter.com/2/tweets",
            token,
            secret,
            "POST"
        )
        await axios.post("https://api.twitter.com/2/tweets", {
            "text": this.params.body
        }, {
            headers: {
                "Content-type": 'application/json',
                "authorization": header
            }
        })
    }
}

let config: ReactionConfig = {
    serviceName: "twitter",
    name: "tweet",
    description: "Tweet something",
    paramTypes: {
        "body": "string"
    },
    create: tweet
}

export default config