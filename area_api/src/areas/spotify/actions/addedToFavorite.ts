import { Action, ActionConfig, AreaRet } from "~/core/types";
import cron, { ScheduledTask } from "node-cron"
import axios, { AxiosResponse } from "axios";
import { SpotifyTrack } from "../utils";

class addedToFavorite extends Action {
    trackNumber: number
    async getPlaylistLen() {
        return await this.refresh(async () => {
            try {
                let res = await axios.get(`https://api.spotify.com/v1/me/tracks?limit=1`, {
                    headers: {
                        "Authorization": "Bearer " + this.token
                    }
                })
                return res.data.total
            } catch (err: any) {
                if (err.response && err.response.status == 401)
                    return AreaRet.AccessTokenExpired
                throw err
            }
            
        })
        
    }

    async getNewPlaylistTracks() {
        let res: AxiosResponse = await this.refresh(async () => {
            try {
                let res = await axios.get(`https://api.spotify.com/v1/me/tracks?limit=1`, {
                    headers: {
                        "Authorization": "Bearer " + this.token
                    }
                })
                return res
            } catch (err: any) {
                if (err.response && err.response.status == 401)
                    return AreaRet.AccessTokenExpired
                throw err
            }
        })
        let mapped: SpotifyTrack[] = res.data.items.map(({ track }: any) => {
            let duration = track.duration / 1000
            return {
                id: track.id,
                title: track.name,
                link: track.external_urls.spotify,
                duration: `${Math.floor(duration / 60)}:${duration % 60}`,
                album: {
                    id: track.album.id,
                    title: track.album.name
                },
                artist: {
                    id: track.artists[0].id,
                    name: track.artists[0].name
                }
            } as SpotifyTrack
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
    serviceName: "spotify",
    name: "addedToLibrary",
    description: "When a track is added to favorite",
    paramTypes: {
    },
    propertiesType: {
        "id": "string",
        "title": "string",
        "link": "string",
        "duration": "string",
        "artist": {
            "id": "string",
            "name": "string"
        },
        "album": {
            "id": "string",
            "title": "string",
        }
    },
    create: addedToFavorite,
}

export default config