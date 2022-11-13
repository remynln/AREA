import { Action, ActionConfig } from "~/core/types";
import cron, { ScheduledTask } from "node-cron"
import axios from "axios";
import { Octokit } from 'octokit'
import { link } from "fs";

interface Stargazer {
    login: string,
    link: string,
    creator: string,
    repository_name: string
}

class newFork extends Action {
    octokit: Octokit
    forkNumber: number
    async getNumberStargazer() {
        let res = await this.refresh(async () => {
            let res2 = await this.octokit.request('GET /repos/{owner}/{repo}/forks', {
                owner: this.params.creator,
                repo: this.params.repository_name
            })
            return (res2.data.length)
        })
        return res
    }

    async getnewForkers(newForkers: number) {
        let res: any
        newForkers = await this.getNumberStargazer()
        if (newForkers > this.forkNumber) {
            res = await this.octokit.request('GET /repos/{owner}/{repo}/forks', {
                owner: this.params.creator,
                repo: this.params.repository_name,
                per_page: (newForkers - this.forkNumber) + ((newForkers > 1) ? 0 : 1),
                page: Math.floor(newForkers/(newForkers - this.forkNumber))
            })
            this.forkNumber = newForkers
        }
        let mapped: Stargazer[] = res.data.map((item: any) => {
            return {
                login: item.owner.login,
                link: item.html_url,
                creator: this.params.creator,
                repository_name: this.params.repository_name
            } as Stargazer
        })
        return mapped
    }

    async loop() {
        let newForkers = await this.getNumberStargazer()
        if (this.forkNumber < newForkers) {
            let newForks = await this.getnewForkers(newForkers)
            for (let i of newForks) {
                this.trigger(i)
            }
        } else if (this.forkNumber > newForkers) {
            this.forkNumber = newForkers
        }
    }

    async start(): Promise<void> {
        this.octokit = new Octokit({
            auth: this.token
        })
        this.forkNumber = await this.getNumberStargazer()
    }
    async stop(): Promise<void> {
    }
}

let config: ActionConfig = {
    serviceName: "github",
    name: "newFork",
    description: "When a repository is forked",
    paramTypes: {
        "creator": "string",
        "repository_name": "string"
    },
    propertiesType: {
        "login": "string",
        "link": "string",
        "creator": "string",
        "repository_name": "string"
    },
    create: newFork,
}

export default config