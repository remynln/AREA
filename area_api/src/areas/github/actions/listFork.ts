import { Action, ActionConfig } from "~/core/types";
import cron, { ScheduledTask } from "node-cron"
import axios from "axios";
import { Octokit } from 'octokit'
import { link } from "fs";



class listFork extends Action {
    start(): Promise<void> {
        throw new Error("Method not implemented.");
    }
    stop(): Promise<void> {
        throw new Error("Method not implemented.");
    }
    const octokit = new Octokit({
        auth: 'YOUR-TOKEN'
      })
      
      await octokit.request('GET /repos/{owner}/{repo}/forks{?sort,per_page,page}', {
        owner: 'this.params.creator',
        repo: 'this.params.repository_name',
      })
}

let config: ActionConfig = {
    serviceName: "github",
    name: "listFork",
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
    create: listFork,
}

export default config