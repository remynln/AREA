import axios from "axios";
import { AreaRet, Action, ActionConfig } from "~/core/types";
import cron, { ScheduledTask } from "node-cron"
import { PassThrough } from "stream";

var operators = {
    '>': function(a:number, b:number){return a>b},
    '<': function(a:number, b:number){return a<b},
    '=': function(a:number, b:number){return a==b}
}

interface Stream {
    viewers: number
    stream_id: string,
    title: string,
    user_name: string,
    game_name: string,
    started_at: string
}

class streamerView extends Action {
    task: ScheduledTask | undefined
    operator: '<' | '>' | '='

    async getStreamInfos(req: any): Promise<Stream> {
        return {
            game_name: req.data.game_name,
            started_at: req.data.started_at,
            stream_id: req.data.id,
            title: req.data.title,
            user_name: req.data.user_name,
            viewers: req.data.viewer_count
        } as Stream
    }

    async loop() {
        const req = await this.refresh(async () => {
            try {
                await axios.get(`https://api.twitch.tv/helix/streams?user_id=${this.params.broadcaster_id}`, {
                    headers: {
                        'Authorization': 'Bearer ' + this.token,
                        'Client-Id': process.env.TWITCH_CLIENT_ID
                    }
                })
            } catch (err: any) {
                if (err.code === 401)
                    return AreaRet.AccessTokenExpired
                throw err
            }
        })
        const stream: Stream = await this.getStreamInfos(req)
        const viewers: number = parseInt(req.data.viewer_count)
        if (operators[this.operator](viewers, this.params.viewers)) {
            this.trigger(stream)
        }
    }

    async start(): Promise<void> {
        this.operator = this.params.operator
        this.task = cron.schedule("*/10 * * * * *", () => {
            this.loop().catch((err) => {
                this.error(err)
            })
        })
    }

    async stop(): Promise<void> {
        if (this.task == undefined)
            return
        this.task.stop()
    }
}

let config: ActionConfig = {
    serviceName: "twitch",
    name: "streamerView",
    description: "Trigger when streamer obtain a certain amount of viewers (op: = < >)",
    paramTypes: {
        viewers: "number",
        operator: "string",
        broadcaster_id: "number"
    },
    propertiesType: {
        viewers: "number",
        stream_id: "string",
        title: "string",
        user_name: "string",
        game_name: "string",
        started_at: "string"
    },
    create: streamerView,
}

export default config