import { AxiosError } from "axios";
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
        error: (err: Error) => void
    ) => Promise<AreaRet>,
    stop: () => void
    destroy: () => void
    [x: string | number | symbol]: unknown;
}

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
    refreshToken: (refreshToken: string) => Promise<string>
    [x: string | number | symbol]: unknown;
}


interface AreaWrapper<T extends Action | Reaction> {
    ref: T,
    params: any,
    token: string | undefined,
    refreshToken: string | undefined,
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
            token: undefined,
            refreshToken: undefined,
        }
        this.reaction = {
            ref: reaction,
            params: reactionParams,
            token: undefined,
            refreshToken: undefined,
        }
        this.condition = condition
        this.accountMail = undefined
    }
    public async setTokens(
        accountMail: string
    ) {
        this.accountMail = accountMail
        for (let i of [this.action, this.reaction]) {
            if (!i.ref.serviceName)
                continue
            [i.token, i.refreshToken] = await db.getToken(accountMail, i.ref.serviceName)
        }
    }

    private async refreshToken(aorea: AreaWrapper<any>) {
        let service = Global.services.get(aorea.ref.serviceName);
        if (!service || !aorea.refreshToken)
            return;
        aorea.token = await service.refreshToken(aorea.refreshToken)
    }

    public formatParams(actionProperties: any) {
        var formatted: any = {}
        for (let key in this.reaction.params) {
            formatted[key] = formatContent(this.reaction.params[key], actionProperties)
        }
        return formatted
    }

    launchReaction(formatted: string, tokenRefreshed: boolean = false) {
        this.reaction.ref.launch(formatted,
        this.reaction.token || '').then((res) => {
            if (res == AreaRet.AccessTokenExpired) {
                if (tokenRefreshed) {
                    return
                }
                this.refreshToken(this.reaction).then((res) => {
                    this.launchReaction(formatted, true)
                })
            }
        }).catch((err) => {
            console.log("Reaction " +
                this.reaction.ref.serviceName + "/" + this.reaction.ref.name +
                " failed")
            console.log(err)
        })
    }

    public async start() {
        var res
        try {
            res = await this.action.ref.start(this.action.params, this.action.token || '',
            this.accountMail || '', (properties) => {
                if (this.condition && !checkCondition(this.condition, properties))
                return;
                var formatted = this.formatParams(properties)
                this.launchReaction(formatted)
            }, (err) => {
                console.log("Actio trigger" +
                this.action.ref.serviceName + "/" + this.action.ref.name +
                "failed")
            })
        } catch (err: any) {
            console.log(err.response)
            throw err
        }
        if (res == AreaRet.AccessTokenExpired) {
            console.log("action token expired")
            this.refreshToken(this.action).then((res) => {
                this.start()
            })
        }
    }

    public destroy() {
        this.action.ref.stop()
    }
}