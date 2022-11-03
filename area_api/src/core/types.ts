import { AxiosError } from "axios";
import { Types } from "mongoose";
import passport from "passport"
import db from "~/database/db";
import { AreaError } from "./errors";
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
        error: (err: Error) => void,
        refreshToken: RefreshTokenFunction
    ) => Promise<void>,
    stop: () => void
    destroy: () => void
    [x: string | number | symbol]: unknown;
}

export type RefreshTokenFunction<T = any> = (requestFunc: () => Promise<AreaRet | T>) => Promise<T>

export interface Reaction {
    serviceName: string | null
    name: string
    description: string
    paramTypes: any
    launch: (params: any, serviceToken: string) => Promise<AreaRet>
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

    private async refreshToken(aorea: AreaWrapper<Action | Reaction>) {
        let service = Global.services.get(aorea.ref.serviceName || '');
        if (!service || !aorea.tokens)
            return;
        var token: string | null = null
        try {
            token = await service.refreshToken(aorea.tokens.refresh)
        } catch (err: any) {
            console.log("Refresh token error for service: " + aorea.ref.serviceName, err)
        }
        if (token == null) {
            console.log(`refresh token expired for service ${aorea.ref.serviceName}`)
            // Todo disconnect user from service
            return
        }
        await aorea.tokens.refreshToken(token)
    }

    public formatParams(actionProperties: any) {
        var formatted: any = {}
        for (let key in this.reaction.params) {
            formatted[key] = formatContent(this.reaction.params[key], actionProperties)
        }
        return formatted
    }

    launchReaction(formatted: string, tokenRefreshed: boolean = false, error: (err: Error) => void) {
        this.reaction.ref.launch(formatted,
        this.reaction.tokens?.access || '').then((res) => {
            if (res == AreaRet.AccessTokenExpired) {
                if (tokenRefreshed) {
                    return
                }
                this.refreshToken(this.reaction).then((res) => {
                    this.launchReaction(formatted, true, error)
                })
            }
        }).catch((err) => {
            console.log("Reaction " +
                this.reaction.ref.serviceName + "/" + this.reaction.ref.name +
                " failed")
            console.log(err)
            error(err)
        })
    }

    async refreshTokenFunc<T>(
        func: () => Promise<AreaRet | T>,
        aorea: AreaWrapper<Action | Reaction>,
        error: (err: Error) => void
    ) {
        var ret
        try {
            ret = await func()
        } catch (err) {
            console.log("func refresh errr")
            error(err as Error)
            return
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
            console.log("Refresh token error for service: " + aorea.ref.serviceName, err)
        }
        if (token == null) {
            console.log(`refresh token expired for service ${aorea.ref.serviceName}`)
            return
        }
        aorea.tokens.refreshToken(token)
        try {
            ret = await func()
        } catch(err) {
            console.log("func refresh errr")
            error(err as Error)
            return
        }
        if (ret == AreaRet.AccessTokenExpired) {
            error(new AreaError(`can't refresh access token for service '${aorea.ref.serviceName}`, 500))
        }
    }

    public async start(error: (err: Error) => void) {
        await this.action.ref.start(this.action.params,
            this.action.tokens?.access || '',
        this.accountMail || '', (properties) => {
            if (this.condition && !checkCondition(this.condition, properties))
                return;
            var formatted = this.formatParams(properties)
            this.launchReaction(formatted, false, error)
        }, (err) => {
            console.log("Action trigger" +
                this.action.ref.serviceName + "/" + this.action.ref.name +
                "failed")
            error(err)
        }, (func) => this.refreshTokenFunc(func, this.action, error))
    }

    public destroy() {
        this.action.ref.stop()
    }
}