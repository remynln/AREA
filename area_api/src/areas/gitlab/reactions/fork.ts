import axios from "axios";
import { AreaRet, Reaction, ReactionConfig } from "~/core/types";

class fork extends Reaction {
    override async launch(): Promise<void> {
        await this.refresh(async () => {
            try {
                let repository_id: number = this.params.repository_id
                let fork_name: string = this.params.fork_name
                let res = await axios.post(`https://gitlab.com/api/v4/projects/${repository_id}/fork?access_token=${this.token}&name=${fork_name}`)
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
    serviceName: "gitlab",
    name: "fork",
    description: "Fork a repository",
    paramTypes: {
        repository_id: "number",
        fork_name: "string"
    },
    create: fork
}

export default config