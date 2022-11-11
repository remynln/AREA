import axios from "axios";
import { ScheduledTask } from "node-cron";
import { AreaError } from "~/core/errors";
import { Action, ActionConfig } from "~/core/types";
import cron from "node-cron"


class newPageCreated extends Action {
    pageId: string
    task: ScheduledTask
    lastUpdate: string
    content: any[]

    async getBlocks() {
        let res = await axios.get(`https://api.notion.com/v1/blocks/${this.pageId}/children`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + this.token,
                "Notion-Version": "2022-06-28"
            }
        })
        return res.data.results
    }

    async getPage() {
        let res = await axios.get(`https://api.notion.com/v1/pages/${this.pageId}`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + this.token,
                "Notion-Version": "2022-06-28"
            }
        })
        return res.data
    }

    async getIdFromUrl(): Promise<string> {
        let pageUrl = this.params.pageUrl as string;
        let res = await axios.post("https://api.notion.com/v1/search", {
        query: pageUrl,
        filter: {
            property: "object",
            value: "page"
        }
        }, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + this.token,
                "Notion-Version": "2022-06-28"
            }
        })
        for (let i of (res.data.results as any[])) {
            if (i.url == pageUrl) {
                this.lastUpdate = i.last_edited_time
                return i.id
            }
        }
        throw new AreaError(`Link '${pageUrl} does not exists'`, 404)
    }

    async loop() {
        let page = await this.getPage()
        if (page.last_edited_time == this.lastUpdate)
            return
        let _content = await this.getBlocks()
        for (let i of _content) {
            if (this.content.find((item) => _content.id == item.id) != undefined)
                continue
        }
        this.content = _content
        this.lastUpdate = page.last_edited_time
    }

    override async start(): Promise<void> {
        this.pageId = await this.getIdFromUrl()
        let page = await this.getPage()
        this.content = await this.getBlocks()
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
    name: "newPageCreated",
    description: "a new notion's page was created",
    paramTypes: {
        pageUrl: "string"
    },
    propertiesType: {},
    create: newPageCreated
}

export default config