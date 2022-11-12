import axios from "axios";
import { Reaction, ReactionConfig } from "~/core/types";


class like extends Reaction {
    override async launch(): Promise<void> {
        let link = ((this.params.url as string)
            .replace('www', 'api')
            + (this.params.url[this.params.url.length - 1] == "/" ? "" : "/")
            + "favorite/")
        let urlWithToken = link + "?access_token=" + this.token
        let res = await axios.post(urlWithToken)
    }
}

let config: ReactionConfig = {
    serviceName: "mixcloud",
    name: "like",
    description: "like a mixcloud's page",
    paramTypes: {
        "url": "string",
    },
    create: like
}

export default config