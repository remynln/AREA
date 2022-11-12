import { Action, ActionConfig } from "~/core/types";
import cron, { ScheduledTask } from "node-cron"
import axios from "axios";
import { SkyrockOauth } from "../reactions/addPost";
import { reseller } from "googleapis/build/src/apis/reseller";
import { AreaError } from "~/core/errors";

interface Post {
    "id": string,
    "title": string,
    "body": string,
    "postNbr": number
}

class newPost extends Action {
    task: ScheduledTask | undefined
    getBlogUrl: string
    nbPost: number

    async getBlog() {
        let [token, secret] = this.token.split(' ')
        let res = await axios.get(this.getBlogUrl, {
            headers: {
                "Authorization": SkyrockOauth.authHeader(
                    this.getBlogUrl,
                    token, secret,
                    "GET"
                )
            }
        })
        return res.data
    }

    async getList(page: number) {
        let listUrl = `https://api.skyrock.com/v2/blog/list_posts.json?username=${this.params.ownerName}&page=${page + 1}`
        let [token, secret] = this.token.split(' ')
        let res = await axios.get(listUrl, {
            headers: {
                "Authorization": SkyrockOauth.authHeader(
                    listUrl,
                    token, secret,
                    "GET"
                )
            }
        })
        return res.data.posts
    }

    async loop() {
        let newNbPost = (await this.getBlog()).nb_posts
        if (this.nbPost >= newNbPost)
            return
        let i = 0
        let list: any = await this.getList(Math.floor(i / 10))
        console.log(list)
        while (i < newNbPost - this.nbPost) {
            let elem = list[Object.keys(list)[Object.keys(list).length - 1 - (i % 10)]]
            this.trigger({
                id: elem.id_post,
                title: elem.title,
                body: elem.text,
                postNbr: i
            } as Post)
            i++;
            if (i % 10 == 0)
                list = await this.getList(Math.floor(i / 10))
        }
        this.nbPost = newNbPost
    }

    async start(): Promise<void> {
        this.getBlogUrl = `https://api.skyrock.com/v2/blog/get.json?username=${this.params.ownerName}`
        try {
            this.nbPost = (await this.getBlog()).nb_posts
        } catch (err: any) {
            if (err.response && err.response.status == 404) {
                throw new AreaError(`user '${this.params.ownerName}' not found`, 404)
            }
            throw err
        }
        ///this.task = cron.schedule("*/10 * * * * *", () => {
        ///    this.loop().catch((err) => {
        ///        this.error(err)
        ///    })
        ///})
    }
    async stop(): Promise<void> {
        if (this.task == undefined)
            return
        this.task.stop()
    }
}

let config: ActionConfig = {
    serviceName: "skyrock",
    name: "newPost",
    description: "When a new post is made in a user's blog",
    paramTypes: {
        "ownerName": "string"
    },
    propertiesType: {
        "id": "string",
        "title": "string",
        "body": "string",
        "postNbr": "number"
    },
    create: newPost,
}

export default config