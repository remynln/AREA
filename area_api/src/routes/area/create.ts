import { Router } from "express";
import checkBody from "~/middlewares/checkBody";
import checkToken from "~/middlewares/checkToken";


var area: Router = Router()

function checkActionReaction(body: any) {
    if (!body.action.name || ! (typeof body.action.name === 'string'))
        return {
            message: `missing or invalid property 'name' in action request`
        }
    if (!body.reaction.name || ! (typeof body.reaction.name === 'string'))
        return {
            message: `missing or invalid property 'name' in reaction request`
        }
    return null
}

area.use("/create",
    checkToken, checkBody(["action", "reaction"]),
(req, res) => {
    let error = checkActionReaction(req.body)
    if (error != null) {
        res.status(400).send(error)
        return
    }
})

export default area;