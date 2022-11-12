import { Action, ActionConfig } from "~/core/types";
import cron, { ScheduledTask } from "node-cron"
import axios from "axios";

interface UserInfo {
    username: string,
    avatar: string,
    banner_color: string
}

class userChanged extends Action {
    username: string
    avatar: string
    banner_color: string
    async getInfo() {
        let res = await this.refresh(async () => {
            let res2 = await axios.get(`https://discord.com/api/users/@me`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            })
            return (res2.data)
        })
        return res
    }

    async getNewInfo(info: any) {
        let res: any
        let current_username: string = info.username
        let current_avatar: string = info.avatar
        let current_banner_color: string = info.banner_color
        if (current_username != this.username || current_avatar != this.avatar || current_banner_color != this.banner_color) {
            res = await axios.get(`https://discord.com/api/users/@me`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            })
            this.username = current_username
            this.avatar = current_avatar
            this.banner_color = current_banner_color
        }
        let mapped: UserInfo = {
            username: res.username,
            avatar: res.avatar,
            banner_color: res.banner_color
        }
        return mapped
    }

    async loop() {
        let info = await this.getInfo()
        let current_username: string = info.username
        let current_avatar: string = info.avatar
        let current_banner_color: string = info.banner_color
        if (current_username != this.username || current_avatar != this.avatar || current_banner_color != this.banner_color) {
            let newInfos = await this.getNewInfo(info)
            this.trigger(newInfos)
        } else {
            this.username = current_username
            this.avatar = current_avatar
            this.banner_color = current_banner_color
        }
    }

    async start(): Promise<void> {
        let info = await this.getInfo()
        this.username = info.username
        this.avatar = info.avatar
        this.banner_color = info.banner_color
    }

    async stop(): Promise<void> {
    }
}

let config: ActionConfig = {
    serviceName: "discord",
    name: "userChanged",
    description: "When a user name, avatar or banner color changed",
    paramTypes: {
    },
    propertiesType: {
        "username": "string",
        "avatar": "string",
        "banner_color": "string",
    },
    create: userChanged,
}

export default config