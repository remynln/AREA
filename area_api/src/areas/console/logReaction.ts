import { Reaction } from "~/core/types";

const logReaction: Reaction<any> = {
    launch(params, _) {
        console.log(params)
    }
}

export default logReaction