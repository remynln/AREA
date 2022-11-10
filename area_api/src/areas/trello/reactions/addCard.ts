import axios from "axios";
import { AreaRet, Reaction, ReactionConfig } from "~/core/types"

class addCard extends Reaction {
    override async launch(): Promise<void> {
        let query = `token=${this.token}&` +
            `key=${process.env.TRELLO_CLIENT_ID}&` +
            `idList=${this.params.listId}&` +
            `name=${this.params.name}&` +
            `desc=${this.params.description}`
        await axios.post(`https://api.trello.com/1/cards?${query}`)
    }
}

let config: ReactionConfig = {
    serviceName: "trello",
    name: "addCard",
    description: "Add a new card to a list",
    paramTypes: {
        listId: "string",
        name: "string",
        description: "string?",
    },
    create: addCard
}

export default config