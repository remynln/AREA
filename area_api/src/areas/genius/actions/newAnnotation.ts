import { ScheduledTask } from "node-cron";
import { Action, ActionConfig } from "~/core/types";
import cron from "node-cron"
import axios from "axios";



class newAnnotation extends Action {
    task: ScheduledTask

    async loop() {
        
    }

    override async start(): Promise<void> {
        this.task = cron.schedule("*/10 * * * * *", () => {
            this.loop().catch((err) => {
                this.error(err)
            })
        })
    }
    override async stop(): Promise<void> {
        
    }
}

let config: ActionConfig = {
    serviceName: "trello",
    name: "newCard",
    description: "When a new list is created",
    paramTypes: {
        "boardId": "string"
    },
    propertiesType: {
        "name": "string",
        "id": "string",
        "boardId": "string",
        "url": "string",
        "cardsNumber": "number"
    },
    create: newCard
}

export default config