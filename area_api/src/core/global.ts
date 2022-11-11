import { AreaError } from "./errors"
import { formatContent } from "./formatting"
import deezer from "./services/deezer"
import google from "./services/google"
import notion from "./services/notion"
import spotify from "./services/spotify"
import trello from "./services/trello"
import github from "./services/github"
import twitch from "./services/twitch"
import pinterest from "./services/pinterest"
import shopify from "./services/shopify"
import { Action, Reaction } from "./types"

const services = new Map([
    ["google", google],
    ["deezer", deezer],
    ["spotify", spotify],
    ["notion", notion],
    ["trello", trello],
    ["github", github],
    ["twitch", twitch],
    ["pinterest", pinterest],
    ["shopify", shopify],
])

function getAction(actionName: string) {
    const splitted = actionName.split('/')
    if (splitted.length != 2) {
        throw new AreaError(`Invalid action name ${actionName}`, 400)
    }
    let service = services.get(splitted[0])
    if (!service)
        throw new AreaError(`Service ${splitted[0]} does not exists`, 404)
    let action = service.actions.get(splitted[1])
    if (!action)
        throw new AreaError(`Service ${splitted[0]} does not have ${splitted[1]} action`, 404)
    return action;
}

function getReaction(reactionName: string) {
    const splitted = reactionName.split('/')
    if (splitted.length != 2) {
        throw new AreaError(`Invalid reaction name ${reactionName}`, 400)
    }
    let service = services.get(splitted[0])
    if (!service)
        throw new AreaError(`Service ${splitted[0]} does not exists`, 404)
    let action = service.reactions.get(splitted[1])
    if (!action)
        throw new AreaError(`Service ${splitted[0]} does not have ${splitted[1]} reaction`, 404)
    return action;
}

function checkParams(paramTypes: {[x: string]: string}, givedParams: any,
    properties: any = undefined) {
    for (let i of Object.entries(paramTypes)) {
        if (givedParams == undefined) {
            if ((i[1] as string).endsWith('?'))
                continue
            throw new AreaError(`Required param '${i[0]}' not found`, 400)
        }
        let current = givedParams[i[0]]
        if (current == undefined) {
            if ((i[1] as string).endsWith('?'))
                continue
            throw new AreaError(`Required param '${i[0]}' not found`, 400)
        }
        let type = (i[1] as string).replace('?', '')
        let currentType = typeof current
        if (typeof current == "string") {
            let content = formatContent(current, properties)
            if (content == "number" && current != "number")
                currentType = "number"
        }
        if (currentType != type)
            throw new AreaError(`type of param '${i[0]}' is ${typeof current}, expected ${type}`, 400)
        if (type == "string" && properties) {
            formatContent(current, properties)
        }
    }
}

export default {
    getAction,
    getReaction,
    checkParams,
    services,
}