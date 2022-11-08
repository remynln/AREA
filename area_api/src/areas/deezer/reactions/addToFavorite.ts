import axios from "axios";
import { Reaction, ReactionConfig } from "~/core/types";

class addToFavorite extends Reaction {
    override async launch(): Promise<void> {
        let songId: number = this.params.songId
        let res = await axios.get(`https://api.deezer.com/user/me/tracks/?access_token=${this.token}&request_method=post&track_id=${songId}`)
    }
}

let config: ReactionConfig = {
    serviceName: "deezer",
    name: "addToFavorite",
    description: "Add a new song to a playlist",
    paramTypes: {
        songId: "number",
    },
    create: addToFavorite
}

export default config