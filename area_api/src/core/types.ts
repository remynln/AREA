import passport from "passport"
import db from "~/database/db";
import { formatContent } from "./formatting";
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
    description: string
    propertiesType: any
    paramTypes: any
    start: (
        trigger: (properties: any) => void,
        params: any,
        token: string
    ) => Promise<AreaRet>,
    stop: () => void
    destroy: () => void
}

export interface Reaction {
    serviceName: string | null
    description: string
    paramTypes: any
    launch: (params: any, serviceToken: string) => Promise<AreaRet>
}

export interface Service {
    start: Function
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
    private _action: AreaWrapper<Action>
    private _reaction: AreaWrapper<Reaction>

    constructor(
        action: Action,
        actionParams: any,
        reaction: Reaction,
        reactionParams: any,
    ) {
        this._action = {
            ref: action,
            params: actionParams,
            token: undefined,
            refreshToken: undefined,
        }
        this._reaction = {
            ref: reaction,
            params: reactionParams,
            token: undefined,
            refreshToken: undefined,
        }
    }
    public async setTokens(
        accountMail: string
    ) {
        for (let i of [this._action, this._reaction]) {
            if (!i.ref.serviceName)
                continue
            [i.token, i.refreshToken] = await db.getToken(accountMail, i.ref.serviceName)
            console.log("bizarre", i.token)
        }
    }

    private async refreshToken(aorea: AreaWrapper<any>) {
        let service = Global.services.get(aorea.ref.serviceName);
        if (!service || !aorea.refreshToken)
            return;
        aorea.token = await service.refreshToken(aorea.refreshToken)
        this.start()
    }

    public formatParams(actionProperties: any) {
        var formatted: any = {}
        for (let key in this._reaction.params) {
            formatted[key] = formatContent(this._reaction.params[key], actionProperties)
        }
        return formatted
    }

    private startPrivate() {
        this._action.ref.start((properties) => {
            var formatted = this.formatParams(properties)
            this._reaction.ref.launch(formatted,
                this._reaction.token || '').then((res) => {
                    if (res == AreaRet.AccessTokenExpired) {
                        this.refreshToken(this._reaction)
                    }
                })
        }, this._action.params, this._action.token || '')
        .then((res) => {
            if (res == AreaRet.AccessTokenExpired) {
                this.refreshToken(this._action)
            }
        })
    }

    public start() {
        this.startPrivate()
    }

    public destroy() {
        this._action.ref.stop()
    }
}