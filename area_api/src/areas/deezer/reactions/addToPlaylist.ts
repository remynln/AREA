import axios from "axios";
import { Reaction, ReactionConfig } from "~/core/types";

class addToPlaylist extends Reaction {
    override async launch(): Promise<void> {
        let songId: number = this.params.songId
        let playlistId: number = this.params.playlistId
        let res = await axios.get(`https://api.deezer.com/playlist/${playlistId}/tracks/?access_token=${this.token}&request_method=post&songs=${songId}`)
    }
}

let config: ReactionConfig = {
    serviceName: "deezer",
    name: "addToPlaylist",
    description: "Add a new song to a playlist",
    paramTypes: {
        songId: "number",
        playlistId: "number"
    },
    create: addToPlaylist
}

export default config