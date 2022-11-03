import { AxiosError } from "axios";
import { Types } from "mongoose";
import passport from "passport"
import db from "~/database/db";
import { AreaError, ProcessError } from "./errors";
import { checkCondition, formatContent } from "./formatting";
import Global from "./global"

type Param = {
    name: string;
    type: string | Param[];
    required?: boolean
} 

type Property = {
    name: string;
    type: String | Property[];
}

export enum AreaRet {
    AccessTokenExpired,
    Ok
}

export interface Action {
    serviceName: string | null
    name: string
    description: string
    propertiesType: any
    paramTypes: any
    start: (
        params: any,
        token: string,
        accountMail: string,
        trigger: (properties: any) => void,
        refreshToken: RefreshTokenFunction,
        error: (err: Error) => void
    ) => Promise<void>,
    stop: () => void
    destroy: () => void
    [x: string | number | symbol]: unknown;
}

export type RefreshTokenFunction<T = any> = (requestFunc: () => Promise<AreaRet | T>) => Promise<T>

export type ErrorFunction = (err: Error) => void

export interface Reaction {
    serviceName: string | null
    name: string
    description: string
    paramTypes: any
    launch: (params: any, serviceToken: string, refresh: RefreshTokenFunction) => Promise<void>
}

export interface Service {
    strategy: passport.Strategy
    actions: Map<string, Action>
    reactions: Map<string, Reaction>
    authParams: any
    refreshToken: (refreshToken: string) => Promise<string | null>
    [x: string | number | symbol]: unknown;
}


interface AreaWrapper<T extends Action | Reaction> {
    ref: T,
    params: any,
    tokens: Tokens | undefined
}

export class Tokens {
    access: string
    refresh: string
    dbId: Types.ObjectId | undefined

    constructor(token: string, refreshToken: string) {
        this.access = token
        this.refresh = token
    }
    async save(email: string, service: string) {
        this.dbId = await db.setToken(this.access, this.refresh, email, service)
    }
    async refreshToken(newAccessToken: string) {
        this.access = newAccessToken
        if (!this.dbId)
            return
        db.token.refresh(this.dbId, newAccessToken)
    }
}

export class Area {
    action: AreaWrapper<Action>
    condition: string | undefined
    reaction: AreaWrapper<Reaction>
    accountMail: string | undefined
    title: string
    description: string

    constructor(
        action: Action,
        actionParams: any,
        condition: string | undefined,
        reaction: Reaction,
        reactionParams: any,
        title: string,
        description: string
    ) {
        this.title = title
        this.description = description
        this.action = {
            ref: action,
            params: actionParams,
            tokens: undefined
        }
        this.reaction = {
            ref: reaction,
            params: reactionParams,
            tokens: undefined
        }
        this.condition = condition
        this.accountMail = undefined
    }

    public async setTokens(
        tokens: Map<string, Tokens>,
        accountMail: string
    ) {
        this.accountMail = accountMail
        for (let i of [this.action, this.reaction]) {
            if (!i.ref.serviceName)
                continue
            let res = tokens.get(i.ref.serviceName)
            if (!res)
                throw new AreaError(`Not connected to service ${i.ref.serviceName}`, 403)
            i.tokens = res
        }
    }

    public formatParams(actionProperties: any) {
        var formatted: any = {}
        for (let key in this.reaction.params) {
            formatted[key] = formatContent(this.reaction.params[key], actionProperties)
        }
        return formatted
    }

    launchReaction(formatted: string, tokenRefreshed: boolean = false, refresh: RefreshTokenFunction, error: (err: ProcessError) => void) {
        this.reaction.ref.launch(formatted,
        this.reaction.tokens?.access || '', refresh).catch((err) => {
            error(new ProcessError(this.reaction.ref.serviceName || "None", this.reaction.ref.name, err))
        })
    }

    async refreshTokenFunc<T>(
        func: () => Promise<AreaRet | T>,
        aorea: AreaWrapper<Action | Reaction>,
        error: (err: ProcessError) => void
    ) {
        var ret
        try {
            ret = await func()
        } catch (err: any) {
            error(new ProcessError(aorea.ref.serviceName || "None", aorea.ref.name, err))
            throw Error()
        }
        if (ret != AreaRet.AccessTokenExpired)
            return ret
        if (!aorea.ref.serviceName)
            return ret
        let service = Global.services.get(aorea.ref.serviceName);
        if (!service || !aorea.tokens)
            return ret;
        var token = null
        try {
            token = await service.refreshToken(aorea.tokens.refresh)
        } catch (err: any) {
            error(new ProcessError(aorea.ref.serviceName || "None", "refreshToken", err))
            throw Error()
        }
        if (token == null) {
            // TODO disconnect user from service
            console.log(`refresh token expired for service ${aorea.ref.serviceName}`)
            throw Error()
        }
        aorea.tokens.refreshToken(token)
        try {
            ret = await func()
        } catch(err) {
            error(new ProcessError(aorea.ref.serviceName || "None", aorea.ref.name, err))
            throw Error()
        }
        if (ret == AreaRet.AccessTokenExpired) {
            let err = new AreaError(`can't refresh access token for service '${aorea.ref.serviceName}`, 500)
            error(new ProcessError(aorea.ref.serviceName || "None", aorea.ref.name, err))
            throw Error()
        }
        return ret
    }

    public async start(error: (err: ProcessError) => void) {
        await this.action.ref.start(
            this.action.params,
            this.action.tokens?.access || '',
            this.accountMail || '',
            (properties) => {
                if (this.condition && !checkCondition(this.condition, properties))
                    return;
                var formatted = this.formatParams(properties)
                this.launchReaction(
                    formatted, false,
                    (func) => this.refreshTokenFunc(func, this.action, error),
                    error
                )
        }, (func) => this.refreshTokenFunc(func, this.action, error),
        (err) => {
            error(new ProcessError(this.action.ref.serviceName || "None", this.action.ref.name, err))
        })
    }

    public destroy() {
        this.action.ref.stop()
    }
}