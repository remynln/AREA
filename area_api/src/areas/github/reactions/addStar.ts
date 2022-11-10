import axios from "axios";
import { AreaRet, Reaction, ReactionConfig } from "~/core/types";
import { Octokit } from 'octokit'

class addStar extends Reaction {
    override async launch(): Promise<void> {
        const octokit = new Octokit({
            auth: this.token
        })
        await this.refresh(async () => {
            try {
                let res = await octokit.request('PUT /user/starred/{owner}/{repo}', {
                    owner: this.params.creator,
                    repo: this.params.repository_name
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
    name: "addStar",
    description: "Add a star to a repo",
    paramTypes: {
        creator: "string",
        repository_name: "string"
    },
    create: addStar
}

export default config