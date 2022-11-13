import axios from "axios";
import { AreaRet, Reaction, ReactionConfig } from "~/core/types";
import { Octokit } from 'octokit'

class createFork extends Reaction {
    override async launch(): Promise<void> {
        const octokit = new Octokit({
            auth: this.token
        })
        await this.refresh(async () => {
            try {
                let res = await octokit.request('POST /repos/{owner}/{repo}/forks', {
                    owner: this.params.creator,
                    repo: this.params.repository_name,
                    organisation: this.params.organisation,
                    default_branch: this.params.default_branch
                })
                return res
            } catch (err: any) {
                if (err.status === 401)
                    return AreaRet.AccessTokenExpired
                throw err
            }
        })
    }
}

let config: ReactionConfig = {
    serviceName: "github",
    name: "createFork",
    description: "create a fork of a repo",
    paramTypes: {
        owner: "string",
        repository_name: "string",
        organisation: "string",
        default_branch: "string"
    },
    create: createFork
}

export default config