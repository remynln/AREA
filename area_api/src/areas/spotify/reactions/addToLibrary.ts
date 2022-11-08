import axios from "axios";
import { AreaRet, Reaction, ReactionConfig } from "~/core/types"

class addToLibrary extends Reaction {
    override async launch(): Promise<void> {
        let songId: string = this.params.songId
        await this.refresh(async () => {
            try {
                let res = await axios.post(`https://api.spotify.com/v1/me/tracks/${songId}`, {}, {
                    headers: {
                        "Authorization": "Bearer " + this.token
                    }
                })
                return res
            } catch (err: any) {
                if (err.response && err.response.status == 401)
                    return AreaRet.AccessTokenExpired
            }
        })
    }
}

let config: ReactionConfig = {
    serviceName: "spotify",
    name: "addToLibrary",
    description: "Add a new song to you personal library",
    paramTypes: {
        songId: "string",
    },
    create: addToLibrary
}

export default config