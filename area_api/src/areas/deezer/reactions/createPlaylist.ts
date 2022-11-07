import axios from "axios";
import { Reaction, ReactionConfig } from "~/core/types";

class createPlaylist extends Reaction {
    override async launch(): Promise<void> {
        let title: string = this.params.title
        let res = await axios.get(`https://api.deezer.com/user/me/playlists/?access_token=${this.token}&request_method=post&title=${title}`)
    }
}

let config: ReactionConfig = {
    serviceName: "deezer",
    name: "createPlaylist",
    description: "Add a new song to a playlist",
    paramTypes: {
        title: "string",
    },
    create: createPlaylist
}

export default config