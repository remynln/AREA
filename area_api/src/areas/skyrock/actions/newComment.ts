import { Action, ActionConfig } from "~/core/types";
import cron, { ScheduledTask } from "node-cron"
import axios from "axios";
import { SkyrockOauth } from "../reactions/addPost";
import { reseller } from "googleapis/build/src/apis/reseller";

interface PostComment {
    id: string,
    body: string,
    from: {
        username: string,
        gender: string,
        id: string
    }
}

class newPost extends Action {
    task: ScheduledTask | undefined
    getPostUrl: string
    nbComments: number

    async getPost() {
        let [token, secret] = this.token.split(' ')
        let res = await axios.get(this.getPostUrl, {
            headers: {
                "Authorization": SkyrockOauth.authHeader(
                    this.getPostUrl,
                    token, secret,
                    "GET"
                )
            }
        })
        return res.data
    }

    async getList(page: number) {
        let listUrl = `https://api.skyrock.com/v2/blog/list_post_comments.json?id_post=${this.params.postId}&page=${page + 1}`
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
        return res.data.comments
    }

    async loop() {
        let newNbComment = (await this.getPost()).nb_comments
        if (this.nbComments >= newNbComment)
            return
        let i = 0
        let list: any[] = await this.getList(Math.floor(i / 10))
        while (i < newNbComment - this.nbComments) {
            let elem = list[i % 10]
            this.trigger({
                id: elem.id_comment,
                body: elem.content,
                from: {
                    gender: ["Non-binary", "Male", "Female"][elem.author.gender],
                    username: elem.author.username,
                    id: elem.author.id_user
                }
            } as PostComment)
            i++;
            if (i % 10 == 0)
                list = await this.getList(Math.floor(i / 10))
        }
        this.nbComments = newNbComment
    }

    async start(): Promise<void> {
        this.getPostUrl = `https://api.skyrock.com/v2/blog/get_post.json?id_post=${this.params.postId}`
        this.nbComments = (await this.getPost()).nb_comments
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
    serviceName: "skyrock",
    name: "newComment",
    description: "When a new comment is made on a user's post",
    paramTypes: {
        "postId": "string"
    },
    propertiesType: {
        "id": "string",
        "body": "string",
        "from": {
            "id": "string",
            "username": "string",
            "gender": "string"
        }
    },
    create: newPost,
}

export default config