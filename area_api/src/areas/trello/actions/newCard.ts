import { ScheduledTask } from "node-cron";
import { Action, ActionConfig } from "~/core/types";
import cron from "node-cron"
import axios from "axios";



class newCard extends Action {
    cardsId: string[]

    async getCards(): Promise<any[]> {
        let query = `token=${this.token}&` +
        `key=${process.env.TRELLO_CLIENT_ID}&`

        let res = await axios.get(`https://api.trello.com/1/boards/${this.params.boardId}/cards?${query}`)
        return res.data
    }

    async loop() {
        let cards = await this.getCards()
        for (let i of cards) {
            if (this.cardsId.includes(i.id))
                continue
            this.trigger({
                name: i.name,
                id: i.id,
                boardId: i.idBoard,
                url: i.shortUrl,
                cardsNumber: cards.length
            })
        }
        this.cardsId = cards.map((item) => item.id)
    }

    override async start(): Promise<void> {
        this.cardsId = (await this.getCards()).map((item) => item.id)
    }
    override async stop(): Promise<void> {
        
    }
}

let config: ActionConfig = {
    serviceName: "trello",
    name: "newCard",
    description: "When a new card is created",
    paramTypes: {
        "boardId": "string"
    },
    propertiesType: {
        "name": "string",
        "id": "string",
        "boardId": "string",
        "url": "string",
        "cardsNumber": "number"
    },
    create: newCard
}

export default config