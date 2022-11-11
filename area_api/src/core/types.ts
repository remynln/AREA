import { AxiosError } from "axios";
import { Types } from "mongoose";
import passport from "passport"
import db from "~/database/db";
import { AreaError, ProcessError } from "./errors";
import { checkCondition, formatContent } from "./formatting";
import Global from "./global"

export interface OAuthCallbackObj {
    data: string,
    username: string,
    refreshToken: string,
    accessToken: string
}

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
    AccessTokenExpired = -1,
    Ok
}

export type ActionConstructor = new(
    trigger: (properties: any) => void,
    refreshToken: RefreshTokenFunction,
    error: (err: Error) => void,
    params: any,
    token: string,
    accountMail: string
) => Action

export abstract class Action {
    trigger: (properties: any) => void
    refresh: RefreshTokenFunction
    error: (err: Error) => void
    params: any
    token: string
    accountMail: string
    abstract start(): Promise<void>
    abstract stop(): Promise<void>

    constructor(
        trigger: (properties: any) => void,
        refreshToken: RefreshTokenFunction,
        error: (err: Error) => void,
        params: any,
        token: string,
        accountMail: string
    ) {
        this.trigger = trigger
        this.refresh = refreshToken
        this.error = error,
        this.params = params,
        this.token = token,
        this.accountMail = accountMail
    }
    //[x: string | number | symbol]: unknown;
}

type PropertyTypeType = {[x: string]: "string" | "number" | PropertyTypeType} 

export interface ActionConfig {
    serviceName: string | null
    name: string
    description: string
    propertiesType: PropertyTypeType
    paramTypes: {[x: string]: string}
    create: ActionConstructor
}

export type RefreshTokenFunction<T = any> = (requestFunc: () => Promise<AreaRet | T>) => Promise<T>

export type ErrorFunction = (err: Error) => void

export type ReactionConstructor = new(
    refresh: RefreshTokenFunction,
    serviceToken: string
) => Reaction

export abstract class Reaction {
    refresh: RefreshTokenFunction
    token: string
    params: any = undefined
    constructor(
        refresh: RefreshTokenFunction,
        serviceToken: string
    ) {
        this.refresh = refresh
        this.token = serviceToken
    }
    abstract launch(): Promise<void>
}

export interface ReactionConfig {
    serviceName: string | null
    name: string
    description: string
    paramTypes: {[x: string]: string}
    create: ReactionConstructor
}

export interface Service {
    strategy: passport.Strategy
    actions: Map<string, ActionConfig>
    reactions: Map<string, ReactionConfig>
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
        this.refresh = refreshToken
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
