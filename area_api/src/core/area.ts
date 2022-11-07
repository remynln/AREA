import { Action, ActionConfig, AreaRet, Reaction, ReactionConfig, Tokens } from "./types"
import Global from "./global"
import AreaInstances from "./instances"
import { AreaError, ProcessError } from "./errors"
import { checkCondition, formatContent } from "./formatting"

function getToken(tokens: Map<string, Tokens>, serviceName: string) {
    let ret = tokens.get(serviceName)
    if (!ret)
        return undefined
    return ret
}

export class Area {
    title: string
    description: string
    action: Action
    reaction: Reaction
    actionTokens: Tokens | undefined
    reactionTokens: Tokens | undefined
    reactionParams: any
    condition: string
    accountMail: string
    actionConf: ActionConfig
    reactionConf: ReactionConfig
    status: "started" | "stopped" | "starting" | "stopping" | "errored" | "locked" = "stopped"
    error: (err: ProcessError) => void

    async refreshTokenFunc<T>(
        func: () => Promise<AreaRet | T>,
        aorea: Action | Reaction,
        aoreaConf: ActionConfig | ReactionConfig,
        tokens: Tokens | undefined
    ) {
        var ret
        try {
            ret = await func()
        } catch (err: any) {
            this.error(new ProcessError(aoreaConf.serviceName || "None", aoreaConf.name, err))
            throw Error()
        }
        if (ret != AreaRet.AccessTokenExpired)
        return ret
        if (!aoreaConf.serviceName)
        return ret
        let service = Global.services.get(aoreaConf.serviceName);
        if (!service || !tokens)
        return ret;
        var token = null
        try {
            token = await service.refreshToken(tokens.refresh)
        } catch (err: any) {
            this.error(new ProcessError(aoreaConf.serviceName || "None", "refreshToken", err))
            throw Error()
        }
        if (token == null) {
            await AreaInstances.disconnectFromService(this.accountMail, aoreaConf.serviceName)
            console.log(`refresh token expired for service ${aoreaConf.serviceName}`)
            throw Error()
        }
        aorea.token = token
        await tokens.refreshToken(token)
        try {
            ret = await func()
        } catch(err) {
            this.error(new ProcessError(aoreaConf.serviceName || "None", aoreaConf.name, err))
            throw Error()
        }
        if (ret == AreaRet.AccessTokenExpired) {
            let err = new AreaError(`can't refresh access token for service '${aoreaConf.serviceName}`, 500)
            this.error(new ProcessError(aoreaConf.serviceName || "None", aoreaConf.name, err))
            throw Error()
        }
        return ret
    }

    launchReaction(actionProperties: any) {
        if (this.condition && !checkCondition(this.condition, actionProperties))
            return
        var formatted: any = {}
        for (let key in this.reactionParams) {
            if (typeof this.reactionParams[key] == "string") {
                let content = formatContent(this.reactionParams[key], actionProperties)
                    formatted[key] = this.reactionConf.paramTypes[key] == "number"
                        ? Number(content)
                        : content
            }
            else {
                formatted[key] = this.reactionParams[key]
            }
        }
        this.reaction.params = formatted
        this.reaction.launch().catch((err) => {
            this.error(new ProcessError(this.reactionConf.serviceName || "None", this.reactionConf.name, err))
        })
    }

    constructor(
        accMail: string,
        tokens: Map<string, Tokens>,
        title: string,
        description: string,
        action: {conf: ActionConfig, params: string | undefined},
        condition: string,
        reaction: {conf: ReactionConfig, params: string | undefined},
        error: (err: ProcessError) => void
    ) {
        this.error = error
        this.accountMail = accMail
        this.title = title
        this.description = description
        this.condition = condition
        this.actionTokens = getToken(tokens, action.conf.serviceName || '')
        this.reactionTokens = getToken(tokens, reaction.conf.serviceName || '')
        if (!this.actionTokens || !this.reactionTokens) {
            this.status = "locked"
        }
        this.reactionParams = reaction.params
        this.actionConf = action.conf
        this.reactionConf = reaction.conf
        this.reaction = new this.reactionConf.create(
            async (func) => this.refreshTokenFunc(func, this.reaction, this.reactionConf, this.reactionTokens),
            this.reactionTokens?.access || '' 
        )
        this.action = new this.actionConf.create(
            (properties) => { this.launchReaction(properties) },
            (func) => this.refreshTokenFunc(func, this.action, this.actionConf, this.actionTokens),
            (err) => error(new ProcessError(this.actionConf.serviceName || "None", this.actionConf.name, err)),
            action.params,
            this.actionTokens?.access || '',
            accMail
        )
    }
    async start() {
        if (this.status != "stopped" && this.status != "errored")
            throw new AreaError(`can't start a ${this.status} area`, 403)
        this.status = "starting"
        try {
            await this.action.start()
        } catch (err) {
            this.status = "errored"
            throw err
        }
        this.status = "started"
    }

    async stop() {
        if (this.status != "started")
            throw new AreaError(`can't stop a ${this.status} area`, 403)
        this.status = "stopping"
        await this.action.stop().catch((err) => {
            this.status = "errored"
        })
        this.status = "stopped"
    }

    async forceStop() {
        this.status = "stopping"
        await this.action.stop().catch((err) => {
            this.status = "errored"
        })
        this.status = "stopped"
    }
}