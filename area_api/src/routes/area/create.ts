import { Router } from "express";
import checkBody from "~/middlewares/checkBody";
import checkToken from "~/middlewares/checkToken";
import AreaFunc from "~/core/global";
import { Action, Area, Reaction } from "~/core/types";
import JwtFormat from "~/routes/auth/jwtFormat"
import jwt from "jsonwebtoken"
import { checkConditionSyntax } from "~/core/formatting";

var area: Router = Router()

function checkActionReaction(body: any) {
    if (!body.action.name || ! (typeof body.action.name === 'string'))
        throw Error(`missing or invalid property 'name' in action request`)
    if (!body.reaction.name || ! (typeof body.reaction.name === 'string'))
        throw Error(`missing or invalid property 'name' in reaction request`)

    let action = AreaFunc.getAction(body.action.name)
    let reaction = AreaFunc.getReaction(body.reaction.name)
    AreaFunc.checkParams(action, body.action.params)
    AreaFunc.checkParams(reaction, body.reaction.params, action.propertiesType)
    return {action, reaction}
}

area.use("/create", checkBody(["action", "reaction"]),
(req, res) => {
    var action: Action
    var reaction: Reaction
    var condition: string | undefined = ''
    try {
        let ret = checkActionReaction(req.body)
        action = ret.action;
        reaction = ret.reaction
        condition = req.body.condition
        if (condition) {
            console.log(action.propertiesType)
            checkConditionSyntax(condition, action.propertiesType)
        }
    } catch (err) {
        console.log("err", err)
        res.status(400).json({
            message: (err as Error).message
        })
        return
    }
    let area = new Area(action, req.body.action.params, condition,
        reaction, req.body.reaction.params)
    let decoded = jwt.decode(req.headers.authorization?.split(' ')[1] || '')
    area.setTokens((decoded as JwtFormat).email).then(() => {
        area.start()
        res.status(201).json({
            message: 'OK'
        })    
    }).catch((err) => {
        res.status(403).json({
            message: (err as Error).message
        }) 
    })
})

export default area;