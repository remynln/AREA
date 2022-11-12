import { Action, ActionConfig } from "~/core/types";
import cron, { ScheduledTask } from "node-cron"
import axios from "axios";
import { link } from "fs";

interface ProjectInfo {
    name: string,
    description: string
}

class projectUpdated extends Action {
    task: ScheduledTask | undefined
    name: string
    description: string
    async getInfo() {
        let res = await this.refresh(async () => {
            let repository_id: number = this.params.repository_id
            let res2 = await axios.get(`https://gitlab.com/api/v4/projects/${repository_id}?access_token=${this.token}`)
            return (res2)
        })
        return res
    }

    async getNewInfo(info: any) {
        let res: any
        let current_name: string = ""
        let current_description: string = ""
        await this.getInfo()
        info.data.map((item: any) => {
            current_name = item.name,
            current_description = item.description
        })
        if (current_name != this.name || current_description != this.description) {
            let repository_id: number = this.params.repository_id
            res = await await axios.get(`https://gitlab.com/api/v4/projects/${repository_id}?access_token=${this.token}`)
            this.name = current_name
            this.description = current_description
        }
        let mapped: ProjectInfo = res.data.map((item: any) => {
            return {
                name: item.name,
                description: item.description
            } as ProjectInfo
        })
        return mapped
    }

    async loop() {
        let info = await this.getInfo()
        let current_name: string = ""
        let current_description: string = ""
        info.data.map((item: any) => {
            current_name = item.name,
            current_description = item.description
        })
        if (current_name != this.name || current_description != this.description) {
            let newInfos = await this.getNewInfo(info)
            this.trigger(newInfos)
        } else {
            this.name = current_name
            this.description = current_description
        }
    }

    async start(): Promise<void> {
        let info = await this.getInfo()
        info.data.map((item: any) => {
            this.name = item.name,
            this.description = item.description
        })
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
    name: "projectUpdated",
    description: "triggers when a project name or description change",
    paramTypes: {
        repository_id: "number"
    },
    propertiesType: {
        "name": "string",
        "description": "string"
    },
    create: projectUpdated,
}

export default config