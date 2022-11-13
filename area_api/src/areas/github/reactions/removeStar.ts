import axios from "axios";
import { Reaction, ReactionConfig } from "~/core/types";
import { Octokit } from 'octokit'

class removeStar extends Reaction {
    override async launch(): Promise<void> {
        const octokit = new Octokit({
            auth: this.token
        })
        octokit.request('DELETE /user/starred/{owner}/{repo}', {
            owner: this.params.creator,
            repo: this.params.repository_name
        })
    }
}

let config: ReactionConfig = {
    serviceName: "github",
    name: "removeStar",
    description: "Remove a star from a repo",
    paramTypes: {
        creator: "string",
        repository_name: "string"
    },
    create: removeStar
}

export default config