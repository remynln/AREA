import axios from "axios";
import { Reaction, ReactionConfig } from "~/core/types";
import { OAuth } from "oauth"
import { TwitterOauth } from "./tweet";

class likeTweet extends Reaction {
    override async launch(): Promise<void> {
        let [token, secret] = this.token.split(' ')
        let userId = token.split('-')[0]
        let header = TwitterOauth.authHeader(
            `https://api.twitter.com/2/users/${userId}/likes`,
            token,
            secret,
            "POST"
        )
        await axios.post(`https://api.twitter.com/2/users/${userId}/likes`, {
            tweet_id: this.params.tweetId
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
    name: "likeTweet",
    description: "Like a tweet",
    paramTypes: {
        "tweetId": "string"
    },
    create: likeTweet
}

export default config