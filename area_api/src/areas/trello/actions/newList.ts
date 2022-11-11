import { ScheduledTask } from "node-cron";
import { Action, ActionConfig } from "~/core/types";
import cron from "node-cron"
import axios from "axios";

interface TrelloList {
    "name": string
    "id": string
}

class newList extends Action {
    task: ScheduledTask
    lastListIds: string[]
    async getLists(): Promise<any[]> {
        let query = `?key=${process.env.TRELLO_CLIENT_ID}&token=${this.token}`
        let res = await axios.get(`https://api.trello.com/1/boards/${this.params.boardId}/lists${query}`)
        return res.data
    }
    async loop() {
        let lists = await this.getLists()
        for (let i of lists) {
            if (this.lastListIds.includes(i.id))
                continue
            this.trigger({
                id: i.id,
                name: i.name,
                listNumber: lists.length
            } as TrelloList)
        }
        this.lastListIds = lists.map((item) => item.id)
    }
    override async start(): Promise<void> {
        this.lastListIds = (await this.getLists()).map((item) => item.id)
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
    serviceName: "trello",
    name: "newList",
    description: "When a new list is created",
    paramTypes: {
        "boardId": "string"
    },
    propertiesType: {
        "name": "string",
        "id": "string",
        "listNumber": "number"
    },
    create: newList
}

export default config