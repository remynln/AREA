import { Reaction } from "~/core/types";

const logReaction: Reaction = {
    serviceName: null,
    paramTypes: {},
    launch(params, _) {
        console.log(params)
    }
}

export default logReaction