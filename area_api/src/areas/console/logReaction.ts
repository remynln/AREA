import { Reaction } from "~/core/types";

const logReaction: Reaction = {
    paramTypes: [],
    launch(params, _) {
        console.log(params)
    }
}

export default logReaction