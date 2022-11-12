import axios from "axios";
import { AreaRet, Reaction, ReactionConfig } from "~/core/types";

class edit extends Reaction {
    override async launch(): Promise<void> {
        await this.refresh(async () => {
            try {
                let repository_id: number = this.params.repository_id
                let new_name: string = this.params.new_name
                let new_description: string = this.params.new_description
                let res = await axios.put(`https://gitlab.com/api/v4/projects/${repository_id}?access_token=${this.token}&name=${new_name}&description=${new_description}`)
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
    name: "edit",
    description: "Edit a repository",
    paramTypes: {
        repository_id: "number",
        new_name: "string",
        new_description: "string"
    },
    create: edit
}

export default config