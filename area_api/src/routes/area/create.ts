import { Router } from "express";
import checkBody from "~/middlewares/checkBody";
import checkToken from "~/middlewares/checkToken";
import AreaFunc from "~/core/global";
import { Action, Area, Reaction } from "~/core/types";
import JwtFormat from "~/routes/auth/jwtFormat"
import jwt from "jsonwebtoken"
import { checkConditionSyntax } from "~/core/formatting";
import { AreaError } from "~/core/errors";
import AreaInstances from "~/core/instances";
import { privateEncrypt } from "node:crypto";

var area: Router = Router()

function checkActionReaction(body: any) {
    if (!body.action.name || ! (typeof body.action.name === 'string'))
        throw new AreaError(`missing or invalid property 'name' in action request`, 400)
    if (!body.reaction.name || ! (typeof body.reaction.name === 'string'))
        throw new AreaError(`missing or invalid property 'name' in reaction request`, 400)

    let action = AreaFunc.getAction(body.action.name)
    let reaction = AreaFunc.getReaction(body.reaction.name)
    AreaFunc.checkParams(action, body.action.params)
    AreaFunc.checkParams(reaction, body.reaction.params, action.propertiesType)
    return {action, reaction}
}

area.post("/create", checkBody(["action", "reaction", "title"]),
(req, res, next) => {
    console.log("HERE");
    let ret = checkActionReaction(req.body)
    var action: Action = ret.action;
    var reaction: Reaction = ret.reaction
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
    let area = new Area(
        action, req.body.action.params,
        condition,
        reaction, req.body.reaction.params,
        req.body.title, req.body.description || ''
    )
    let decoded = jwt.decode(req.headers.authorization?.split(' ')[1] || '')
    AreaInstances.add(area, res.locals.userInfo.email).then(() => {
        res.status(201).json({
            message: 'OK'
        })
    }).catch((err) => next(err))
})

export default area;