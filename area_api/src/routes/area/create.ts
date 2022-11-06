import { Router } from "express";
import checkBody from "~/middlewares/checkBody";
import checkToken from "~/middlewares/checkToken";
import AreaFunc from "~/core/global";
import { Action, ActionConfig, Reaction, ReactionConfig } from "~/core/types";
import JwtFormat from "~/routes/auth/jwtFormat"
import jwt from "jsonwebtoken"
import { checkConditionSyntax } from "~/core/formatting";
import { AreaError } from "~/core/errors";
import AreaInstances, { AreaConfig } from "~/core/instances";

var area: Router = Router()

function checkActionReaction(body: any) {
    if (!body.action.name || ! (typeof body.action.name === 'string'))
        throw new AreaError(`missing or invalid property 'name' in action request`, 400)
    if (!body.reaction.name || ! (typeof body.reaction.name === 'string'))
        throw new AreaError(`missing or invalid property 'name' in reaction request`, 400)

    let action = AreaFunc.getAction(body.action.name)
    let reaction = AreaFunc.getReaction(body.reaction.name)
    AreaFunc.checkParams(action.paramTypes, body.action.params)
    AreaFunc.checkParams(reaction.paramTypes, body.reaction.params, action.propertiesType)
    return {action, reaction}
}

area.post("/create", checkBody(["action", "reaction", "title"]),
    (req, res, next) => {

    let ret = checkActionReaction(req.body)
    var action: ActionConfig = ret.action;
    var reaction: ReactionConfig = ret.reaction
    var condition: string | undefined = req.body.condition

    if (!res.locals.userInfo) {
        res.status(500).send({
            message: "Internal server error"
        })
        console.log("create route needs checkToken middleware")
    }
    if (condition) {
        console.log(action.propertiesType)
        checkConditionSyntax(condition, action.propertiesType)
    }
    let conf: AreaConfig = {
        title: req.body.title,
        condition: req.body.condition,
        action: {
            conf: action,
            params: req.body.action.params
        },
        description: req.body.description || '',
        reaction: {
            conf: reaction,
            params: req.body.reaction.params
        }
    }
    let decoded = jwt.decode(req.headers.authorization?.split(' ')[1] || '')
    AreaInstances.add(conf, res.locals.userInfo.email).then(() => {
        res.status(201).json({
            message: 'OK'
        })
    }).catch((err) => next(err))
})

export default area;