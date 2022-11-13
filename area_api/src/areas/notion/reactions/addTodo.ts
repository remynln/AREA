import axios from "axios";
import { Reaction, ReactionConfig } from "~/core/types";
import { getPageId } from "../utils";


class addTodo extends Reaction {
    override async launch(): Promise<void> {
        let id = await getPageId(this.token, this.params.pageId as string)
        let res = await axios.patch(`https://api.notion.com/v1/blocks/${id}/children`, {
            children: [{ to_do: {
                rich_text: [{
                    text: {
                        content: this.params.text as string
                    }
                }],
                checked: (this.params.checked != 0)
            }}]
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
    name: "addTodo",
    description: "Add a new todo to a specific notion's page",
    paramTypes: {
        "pageId": "string",
        "text": "string",
        "checked": "number"
    },
    create: addTodo
}

export default config