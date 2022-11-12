import { Action, ActionConfig } from "~/core/types";
import cron, { ScheduledTask } from "node-cron"
import axios from "axios";
import { Octokit } from 'octokit'
import { link } from "fs";

interface Stargazer {
    login: string,
    link: string
}

class starRemoved extends Action {
    octokit: Octokit
    starNumber: number
    async getNumberStargazer() {
        let res = await this.refresh(async () => {
            let res2 = await this.octokit.request('GET /repos/{owner}/{repo}/stargazers', {
                owner: this.params.creator,
                repo: this.params.repository_name
            })
            return (res2.data.length)
        })
        return res
    }

    async getNewStargazers(newStargazers: number) {
        let res: any
        newStargazers = await this.getNumberStargazer()
        if (newStargazers < this.starNumber) {
            res = await this.octokit.request('GET /repos/{owner}/{repo}/stargazers', {
                owner: this.params.creator,
                repo: this.params.repository_name,
                per_page: (newStargazers - this.starNumber) + ((newStargazers > 1) ? 0 : 1),
                page: Math.floor(newStargazers/(newStargazers - this.starNumber))
            })
            this.starNumber = newStargazers
        }
        let mapped: Stargazer[] = res.data.map((item: any) => {
            return {
                login: item.login,
                link: item.html_url
            } as Stargazer
        })
        return mapped
    }

    async loop() {
        let newStargazers = await this.getNumberStargazer()
        if (this.starNumber > newStargazers) {
            let newStars = await this.getNewStargazers(newStargazers)
            for (let i of newStars) {
                this.trigger(i)
            }
        } else if (this.starNumber < newStargazers) {
            this.starNumber = newStargazers
        }
    }

    async start(): Promise<void> {
        this.octokit = new Octokit({
            auth: this.token
        })
        this.starNumber = await this.getNumberStargazer()
    }
    async stop(): Promise<void> {
    }
}

let config: ActionConfig = {
    serviceName: "github",
    name: "starRemoved",
    description: "triggers when a star is removed from a repository",
    paramTypes: {
        "creator": "string",
        "repository_name": "string"
    },
    propertiesType: {
        "login": "string",
        "link": "string",
    },
    create: starRemoved,
}

export default config