import axios from "axios";
import { AreaRet, Reaction, ReactionConfig } from "~/core/types"

class addList extends Reaction {
    override async launch(): Promise<void> {
        let query = `token=${this.token}&` +
            `key=${process.env.TRELLO_CLIENT_ID}&` +
            `name=${this.params.name}&`
        await axios.post(`https://api.trello.com/1/boards/${this.params.boardId}/lists?${query}`)
    }
}

let config: ReactionConfig = {
    serviceName: "trello",
    name: "addList",
    description: "Add a new list to a board",
    paramTypes: {
        boardId: "string",
        name: "string",
    },
    create: addList
}

export default config