import { Action, ActionConfig } from "~/core/types";
import cron, { ScheduledTask } from "node-cron"
import axios from "axios";
import { link } from "fs";

interface Stargazer {
    username: string,
    name: string,
    id: number
}

class newStar extends Action {
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
        if (newStargazers > this.starNumber) {
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
        if (this.starNumber < newStargazers) {
            let newStars = await this.getNewStarNumber(newStargazers)
            for (let i of newStars) {
                this.trigger(i)
            }
        } else if (this.starNumber > newStargazers) {
            this.starNumber = newStargazers
        }
    }

    async start(): Promise<void> {
        this.starNumber = await this.getStarNumber()
    }
    async stop(): Promise<void> {
    }
}

let config: ActionConfig = {
    serviceName: "gitlab",
    name: "newStar",
    description: "triggers when a star is added to a repository",
    paramTypes: {
        repository_id: "number"
    },
    propertiesType: {
        "username": "string",
        "name": "string",
        "id": "number"
    },
    create: newStar,
}

export default config