import { Router } from "express";
import checkBody from "~/middlewares/checkBody";
import checkToken from "~/middlewares/checkToken";
import Area from "~/core/global";

var area: Router = Router()

function checkActionReaction(body: any) {
    if (!body.action.name || ! (typeof body.action.name === 'string'))
        throw Error(`missing or invalid property 'name' in action request`)
    if (!body.reaction.name || ! (typeof body.reaction.name === 'string'))
        throw Error(`missing or invalid property 'name' in reaction request`)

    let action = Area.getAction(body.action.name)
    let reaction = Area.getReaction(body.reaction.name)
    Area.checkParams(action, body.action.params)
    Area.checkParams(reaction, body.reaction.params)
    return [action, reaction]
}

area.use("/create", checkBody(["action", "reaction"]),
(req, res) => {
    var action
    var reaction
    try {
        [action, reaction] = checkActionReaction(req.body)
    } catch (err) {
        console.log("err", err)
        res.status(400).json({
            message: (err as Error).message
        })
        return
    }
    res.status(200).json({
        message: 'OK'
    })
})

export default area;