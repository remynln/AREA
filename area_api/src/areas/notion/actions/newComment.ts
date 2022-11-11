import axios from "axios";
import { ScheduledTask } from "node-cron";
import { AreaError } from "~/core/errors";
import { Action, ActionConfig } from "~/core/types";
import cron from "node-cron"
import { getPageId } from "../utils";

interface Comment {
    "body": string,
    "user": string,
    "postedAt": string
}

class newComment extends Action {
    pageId: string
    comments: string[]
    task: ScheduledTask

    async getComments(): Promise<any[]> {
        let res = await axios.get(`https://api.notion.com/v1/comments?block_id=${this.pageId}`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + this.token,
                "Notion-Version": "2022-06-28"
            }
        })
        return res.data.results
    }

    async getUser(userId: string) {
        let res = await axios.get(`https://api.notion.com/v1/users/${userId}`, {
            headers: {
                "Authorization": "Bearer " + this.token,
                "Notion-Version": "2022-06-28"
            }
        })
        return res.data
    }

    async loop() {
        let newComments = (await this.getComments())
        for (let i of newComments) {
            if (this.comments.includes(i.id))
                continue
            this.trigger({
                body: i.rich_text[0].plain_text,
                postedAt: i.created_time,
                user: (await this.getUser(i.created_by.id)).name
            } as Comment)
        }
        this.comments = newComments.map((item) => item.id)
    }

    override async start(): Promise<void> {
        this.pageId = await getPageId(this.token, this.params.pageId as string)
        this.comments = (await this.getComments()).map((res) => res.id)
        this.task = cron.schedule("*/10 * * * * *", () => {
            this.loop().catch((err) => {
                this.error(err)
            })
        })
    }

    override async stop(): Promise<void> {
        if (this.task == undefined)
            return
        this.task.stop()
    }
}

let config: ActionConfig = {
    serviceName: "notion",
    name: "newComment",
    description: "a new notion's page was created",
    paramTypes: {
        pageId: "string"
    },
    propertiesType: {
        "body": "string",
        "user": "string",
        "postedAt": "string"
    },
    create: newComment
}

export default config