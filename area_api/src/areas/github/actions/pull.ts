import { Action, ActionConfig } from "~/core/types";
import cron, { ScheduledTask } from "node-cron"
import axios from "axios";
import { Octokit } from 'octokit'
import { link } from "fs";

class pull extends Action {
    override async start(): Promise<void> {
        const octokit = new Octokit({
            auth: this.token
        })
        await this.refresh(async () => {
                let res = await octokit.request('GET /repos/{owner}/{repo}/pulls{?state,head,base,sort,direction,per_page,page}', {
                    owner: this.params.creator,
                    repo: this.params.repository_name,
                  })
                return res
        })
    }
    override async stop(): Promise<void> {
        this.stop()
    }
}   
let config: ActionConfig = {
    serviceName: "github",
    name: "pull",
    description: "triggers when a star is added to a repository",
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
    create: pull,
}

export default config