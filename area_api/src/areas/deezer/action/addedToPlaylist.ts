import { Action, ActionConfig } from "~/core/types";
import cron from "node-cron"
import axios from "axios";

class addedToPlaylist extends Action {
    async getPlaylist() {
        let id = this.params.playlistId as string
        let res = await axios.get("https://api.deezer.com/playlist/908622995",{
            headers: {
                "Authorization": "Bearer" + this.token
            }
        })
        console.log(res)
    }

    async start(): Promise<void> {
        cron.schedule("*/20 * * * * *", () => {
            console.log("lets gooo", this.params.playlistId)
        })
    }
    async stop(): Promise<void> {
        cron.getTasks()
    }
}

let config: ActionConfig = {
    serviceName: "deezer",
    name: "addedToPlaylist",
    description: "triggers when a track is added to a playlist",
    paramTypes: {
        "playlistId": "string" 
    },
    propertiesType: {
        "id": "number",
        "title": "string",
        "link": "string",
        "duration": "string",
        "release_date": "string",
        "bpm": "number",
        "artist": {
            "id": "string",
            "name": "string"
        },
        "album": {
            "id": "string",
            "name": "string",
            "cover": "string"
        }
    },
    create: addedToPlaylist,
}