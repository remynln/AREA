import axios from "axios";
import { AreaRet, Reaction, ReactionConfig } from "~/core/types";

class addToFavorite extends Reaction {
    override async launch(): Promise<void> {
        let songId: number = this.params.songId
        let res = await this.refresh(async () => {
            try {
                await axios.put(`https://api.twitch.tv/helix/users/blocks?target_user_id=${this.params.userId}`, {
                    headers: {
                        'Authorization': 'Bearer ' + this.token,
                        'Client-Id': process.env.TWITCH_CLIENT_ID
                    }
                })
            } catch (err: any) {
                if (err.code == 401)
                    return AreaRet.AccessTokenExpired
                throw err
            }
        })
    }
}

let config: ReactionConfig = {
    serviceName: "twitch",
    name: "blockUser",
    description: "Block an user",
    paramTypes: {
        userId: "string",
    },
    create: addToFavorite
}

export default config