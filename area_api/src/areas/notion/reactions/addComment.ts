import axios from "axios";
import { Reaction, ReactionConfig } from "~/core/types";
import { getPageId } from "../utils";


class addComment extends Reaction {
    override async launch(): Promise<void> {
        let id = await getPageId(this.token, this.params.pageId as string)
        let res = await axios.post(`https://api.notion.com/v1/comments`, {
            parent: {
                page_id: id
            },
            rich_text: [{
                text: {
                    content: this.params.body as string
                }
            }]
        }, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + this.token,
                "Notion-Version": "2022-06-28"
            }
        })
    }
}

let config: ReactionConfig = {
    serviceName: "notion",
    name: "addComment",
    description: "Add a new comment to a specific notion's page",
    paramTypes: {
        "pageId": "string",
        "body": "string",
    },
    create: addComment
}

export default config