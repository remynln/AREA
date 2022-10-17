import google from "./services/google"
import { Action, Area, Reaction } from "./types"

const services = new Map([
    ["google", google]
])

function getAction(actionName: string) {
    const splitted = actionName.split('/')
    if (splitted.length != 2) {
        throw Error(`Invalid action name ${actionName}`)
    }
    let service = services.get(splitted[0])
    if (!service)
        throw Error(`Service ${splitted[0]} does not exists`)
    let action = service.actions.get(splitted[1])
    if (!action)
        throw Error(`Service ${splitted[0]} does not have ${splitted[1]} action`)
    return action;
}

function getReaction(reactionName: string) {
    const splitted = reactionName.split('/')
    if (splitted.length != 2) {
        throw Error(`Invalid reaction name ${reactionName}`)
    }
    let service = services.get(splitted[0])
    if (!service)
        throw Error(`Service ${splitted[0]} does not exists`)
    let action = service.reactions.get(splitted[1])
    if (!action)
        throw Error(`Service ${splitted[0]} does not have ${splitted[1]} reaction`)
    return action;
}

function checkParams(actionReaction: Action | Reaction, givedParams: any) {
    for (let i of Object.entries(actionReaction.paramTypes)) {
        if (!givedParams) {
            if ((i[1] as string).endsWith('?'))
                continue
            throw Error(`Required param '${i[0]}' not found`)
        }
        let current = givedParams[i[0]]
        if (!current) {
            if ((i[1] as string).endsWith('?'))
                continue
            throw Error(`Required param '${i[0]}' not found`)
        }
        let type = (i[1] as string).replace('?', '')
        if (typeof current != type)
            throw Error(`type of param '${i[0]}' is ${typeof current}, expected ${type}`)
    }
}

function checkPropertyExistance(
    action: Action,
    completePropertyName: string,
    propertyExpectedType: string | null = null) {
    let splitted = completePropertyName.split('.')

    if (splitted.length < 2)
        throw Error("Invalid property usage")
    if (splitted[0] != "Action")
        throw Error("Properties not attached to action are not implemented")
    if (!action.propertiesType[splitted[1]])
        throw Error(`Property ${completePropertyName} does not exists`)
    if (propertyExpectedType != null && action.propertiesType[splitted[1]] != propertyExpectedType)
        throw Error(`Property type must be ${propertyExpectedType}, but it's ${action.propertiesType[splitted[1]]}`)
}

function createArea(
    action: Action, actionParams: any,
    reaction: Reaction, reactionParams: any
) {
    //let area = new Area(action, actionParams, reaction, reactionParams)
}

export default {
    getAction,
    getReaction,
    checkParams,
    services,
    checkPropertyExistance
}