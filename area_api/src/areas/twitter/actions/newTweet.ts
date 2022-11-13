import { ScheduledTask } from "node-cron";
import { Action, ActionConfig } from "~/core/types";
import cron from "node-cron"
import axios from "axios";
import { TwitterOauth } from "../reactions/tweet";

interface ParamTypes {
    from: string,
}

class newTweet extends Action {
    lastId: string | undefined
    async searchTweet() {
        let params = this.params as ParamTypes
        let query = `?query=from%3A${params.from}` +
        (this.lastId ? `&since_id=${this.lastId}` : "")
        let [token, secret] = this.token.split(' ')
        let header = TwitterOauth.authHeader(
            "https://api.twitter.com/2/tweets/search/recent" + query,
            token,
            secret,
            "GET"
        )
        let res = await axios.get("https://api.twitter.com/2/tweets/search/recent" + query, {
            headers: {
                "authorization": header
            }
        })
        return (res.data)
    }

    async loop() {
        let res = await this.searchTweet()
        if (res.meta.newest_id)
            this.lastId = res.meta.newest_id
        if (!res.data) {
            return
        }
        for (let i of res.data) {
            this.trigger({
                id: i.id,
                body: i.text
            })
        }
    }

    override async start(): Promise<void> {
        let res = await this.searchTweet()
        this.lastId = res.meta.newest_id
    }
    override async stop(): Promise<void> {
    }
}

let config: ActionConfig = {
    serviceName: "twitter",
    name: "newTweet",
    description: "When a new tweet is posted",
    paramTypes: {
        "from": "string",
    },
    propertiesType: {
        "id": "string",
        "body": "string"
    },
    create: newTweet
}

export default config