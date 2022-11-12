import { Action, ActionConfig } from "~/core/types";
import cron, { ScheduledTask } from "node-cron"
import axios from "axios";
import { getPlaylistTracks } from "../utils";

interface DeezerTrack {
    id: number,
    title: string,
    link: string,
    duration: string,
    artist: {
        id: number,
        name: string
    },
    album: {
        id: number,
        title: string,
    }
}

class addedToPlaylist extends Action {
    trackNumber: number
    async getPlaylistLen() {
        let id = this.params.playlistId as string
        let res = await axios.get(`https://api.deezer.com/playlist/${id}?access_token=${this.token}`)
        return res.data.nb_tracks
    }

    async getNewPlaylistTracks() {
        let id = this.params.playlistId as string
        let res = await axios.get(`https://api.deezer.com/playlist/${id}/tracks?access_token=${this.token}&index=${this.trackNumber}`)
        let mapped: DeezerTrack[] = res.data.data.map((item: any) => {
            return {
                id: item.id,
                title: item.title,
                link: item.link,
                duration: `${Math.floor(item.duration / 60)}:${item.duration % 60}`,
                album: {
                    id: item.album.id,
                    title: item.album.title
                },
                artist: {
                    id: item.artist.id,
                    name: item.artist.name
                }
            } as DeezerTrack
        })
        return mapped
    }

    async loop() {
        let newTrackNumber = await this.getPlaylistLen()
        if (this.trackNumber < newTrackNumber) {
            let newTracks = await this.getNewPlaylistTracks()
            for (let i of newTracks) {
                this.trigger(i)
            }
        }
        this.trackNumber = newTrackNumber
    }

    async start(): Promise<void> {
        this.trackNumber = await this.getPlaylistLen()
    }
    async stop(): Promise<void> {
    }
}

let config: ActionConfig = {
    serviceName: "deezer",
    name: "addedToPlaylist",
    description: "When a track is added to a playlist",
    paramTypes: {
        "playlistId": "number" 
    },
    propertiesType: {
        "id": "number",
        "title": "string",
        "link": "string",
        "duration": "string",
        "artist": {
            "id": "number",
            "name": "string"
        },
        "album": {
            "id": "number",
            "title": "string",
        }
    },
    create: addedToPlaylist,
}

export default config