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

export default router