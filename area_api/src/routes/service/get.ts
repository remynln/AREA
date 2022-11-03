import { Router } from "express";
import global from "~/core/global"

var router = Router()

router.get('/:serviceName/actions', (req, res) => {
    let service = global.services.get(req.params.serviceName)
    if (!service) {
        res.status(404).json({
            message: `Service with name ${req.params.serviceName} not found`
        })
        return
    }
    res.status(200).json(
        Array.from(service.actions, ([name, action]) => {
            return {
                name: name,
                description: action.description
            }
        })
    )
})

router.get('/:serviceName/reactions', (req, res) => {
    let service = global.services.get(req.params.serviceName)
    if (!service) {
        res.status(404).json({
            message: `Service with name ${req.params.serviceName} not found`
        })
        return
    }
    res.status(200).json(
        Array.from(service.reactions, ([name, reaction]) => {
            return {
                name: name,
                description: reaction.description
            }
        })
    )
})

router.get('/:serviceName/action/:actionName', (req, res) => {
    let service = global.services.get(req.params.serviceName)
    if (!service) {
        res.status(404).json({
            message: `Service with name ${req.params.serviceName} not found`
        })
        return
    }
    let action = service.actions.get(req.params.actionName)
    if (!action) {
        res.status(404).json({
            message: `Action with name ${req.params.actionName} not found`
        })
        return
    }
    res.status(200).json({
        parameters: action.paramTypes,
        properties: action.propertiesType
    })
})

router.get('/:serviceName/reaction/:reactionName', (req, res) => {
    let service = global.services.get(req.params.serviceName)
    if (!service) {
        res.status(404).json({
            message: `Service with name ${req.params.serviceName} not found`
        })
        return
    }
    let reaction = service.reactions.get(req.params.reactionName)
    if (!reaction) {
        res.status(404).json({
            message: `Reaction with name ${req.params.reactionName} not found`
        })
        return
    }
    res.status(200).json({
        parameters: reaction.paramTypes
    })
})

export default router