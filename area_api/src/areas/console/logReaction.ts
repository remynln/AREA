import { Reaction } from "~/core/types";

const logReaction: Reaction<any> = {
    launch(params) {
        console.log(params)
    }
}

export default logReaction