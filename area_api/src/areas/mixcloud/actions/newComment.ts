import { ScheduledTask } from "node-cron";
import { Action, ActionConfig } from "~/core/types";
import cron from "node-cron"
import axios from "axios";

interface ParamTypes {
    from: string,
}

class newComment extends Action {
    link: string
    lastCommandDate: string | undefined

    async getComments() {
        let urlWithToken = this.link + "?access_token=" + this.token
        let dateQuery = this.lastCommandDate
            ? "&since=" + this.lastCommandDate
            : ""
        let res = await axios.get(urlWithToken + dateQuery)
        if (res.data.data.length != 0) {
            this.lastCommandDate = (res.data.data[0].submit_date as string)
                .replace("T", "+")
                .replaceAll(":", "%3A")
                .replace("Z", "")
        }
        return res.data
    }

    formatLink() {
        this.link = ((this.params.url as string)
            .replace('www', 'api')
            + (this.params.url[this.params.url.length - 1] == "/" ? "" : "/")
            + "comments")
    }
    async loop() {
        let data = await this.getComments()
        for (let i of data.data) {
            this.trigger({
                url: i.url,
                body: i.comment,
                user: {
                    name: i.user.name,
                    url: i.user.url
                },
                date: i.submit_date
            })
        }
    }

    override async start(): Promise<void> {
        this.formatLink()
        await this.getComments()
    }
    override async stop(): Promise<void> {
    }
}

let config: ActionConfig = {
    serviceName: "mixcloud",
    name: "newComment",
    description: "When a new comment is posted to a page",
    paramTypes: {
        "url": "string",
    },
    propertiesType: {
        "url": "string",
        "body": "string",
        "user": {
            "name": "string",
            "url": "string"
        },
        "date": "string"
    },
    create: newComment
}

export default config