import { Action, ActionConfig } from "~/core/types";
import cron, { ScheduledTask } from "node-cron"
import axios from "axios";
import { link } from "fs";

interface Stargazer {
    username: string,
    name: string,
    id: number
}

class starRemoved extends Action {
    task: ScheduledTask | undefined
    starNumber: number
    async getStarNumber() {
        let res = await this.refresh(async () => {
            let repository_id: number = this.params.repository_id
            let res2 = await axios.get(`https://gitlab.com/api/v4/projects/${repository_id}/starrers?access_token=${this.token}`)
            return (res2.data.length)
        })
        return res
    }

    async getNewStarNumber(newStargazers: number) {
        let res: any
        newStargazers = await this.getStarNumber()
        if (newStargazers < this.starNumber) {
            let repository_id: number = this.params.repository_id
            res = await axios.get(`https://gitlab.com/api/v4/projects/${repository_id}/starrers?access_token=${this.token}`)
            this.starNumber = newStargazers
        }
        let mapped: Stargazer[] = res.data.map((item: any) => {
            return {
                username: item.user.username,
                name: item.user.name,
                id: item.user.id,
            } as Stargazer
        })
        return mapped
    }

    async loop() {
        let newStargazers = await this.getStarNumber()
        if (this.starNumber > newStargazers) {
            let newStars = await this.getNewStarNumber(newStargazers)
            for (let i of newStars) {
                this.trigger(i)
            }
        } else if (this.starNumber < newStargazers) {
            this.starNumber = newStargazers
        }
    }

    async start(): Promise<void> {
        this.starNumber = await this.getStarNumber()
        this.task = cron.schedule("*/10 * * * * *", () => {
            this.loop().catch((err) => {
                this.error(err)
            })
        })
    }
    async stop(): Promise<void> {
        if (this.task == undefined)
            return
        this.task.stop()
    }
}

let config: ActionConfig = {
    serviceName: "gitlab",
    name: "starRemoved",
    description: "triggers when a star is removed from a repository",
    paramTypes: {
        repository_id: "number"
    },
    propertiesType: {
        "username": "string",
        "name": "string",
        "id": "number"
    },
    create: starRemoved,
}

export default config