import axios from "axios";
import { Reaction, ReactionConfig } from "~/core/types";
import { Octokit } from 'octokit'

class addStar extends Reaction {
    override async launch(): Promise<void> {
        const octokit = new Octokit({
            auth: this.token
        })
        octokit.request('PUT /user/starred/{owner}/{repo}', {
            owner: this.params.creator,
            repo: this.params.repository_name
        })
    }
}

let config: ReactionConfig = {
    serviceName: "github",
    name: "addStar",
    description: "Add a star to a repo",
    paramTypes: {
        creator: "string",
        repository_name: "string"
    },
    create: addStar
}

export default config