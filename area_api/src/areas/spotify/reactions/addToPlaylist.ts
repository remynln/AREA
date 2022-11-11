import axios from "axios";
import { AreaRet, Reaction, ReactionConfig } from "~/core/types"

class addToPlaylist extends Reaction {
    override async launch(): Promise<void> {
        let songId: string = this.params.songId
        let playlistId: string = this.params.playlistId
        await this.refresh(async () => {
            try {
                let res = await axios.post(`https://api.spotify.com/v1/playlists/${playlistId}`, {}, {
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
    name: "addToPlaylist",
    description: "Add a new song to you personal library",
    paramTypes: {
        playlistId: "string",
        songId: "string",
    },
    create: addToPlaylist
}

export default config