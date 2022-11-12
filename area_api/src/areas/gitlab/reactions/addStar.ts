import axios from "axios";
import { AreaRet, Reaction, ReactionConfig } from "~/core/types";

class addStar extends Reaction {
    override async launch(): Promise<void> {
        await this.refresh(async () => {
            try {
                let repository_id: number = this.params.repository_id
                let res = await axios.post(`https://gitlab.com/api/v4/projects/${repository_id}/star?access_token=${this.token}`)
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
    name: "addStar",
    description: "Add a star to a repo",
    paramTypes: {
        repository_id: "number"
    },
    create: addStar
}

export default config