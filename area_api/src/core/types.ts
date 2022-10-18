import passport from "passport"
import db from "~/database/db";

type Param = {
    name: string;
    type: string | Param[];
    required?: boolean
} 

type Property = {
    name: string;
    type: String | Property[];
} 

export interface Action {
    serviceName: string | null
    propertiesType: any
    paramTypes: any
    start: (
        trigger: (properties: any) => void,
        params: any,
        token: string
    ) => void,
    stop: () => void
    destroy: () => void
}

export interface Reaction {
    serviceName: string | null
    paramTypes: any
    launch: (params: any, serviceToken: string) => void
}

export interface Service {
    start: Function,
    strategy: passport.Strategy,
    actions: Map<string, Action>,
    reactions: Map<string, Reaction>

    [x: string | number | symbol]: unknown;
}

export class Area {
    private _action: {ref: Action, params: any, token: string | null}
    private _reaction: {ref: Reaction, params: any, token: string | null}

    constructor(
        action: Action,
        actionParams: any,
        reaction: Reaction,
        reactionParams: any,
    ) {
        this._action = {
            ref: action,
            params: actionParams,
            token: null
        }
        this._reaction = {
            ref: reaction,
            params: reactionParams,
            token: null
        }
    }
    public async setTokens(
        accountMail: string
    ) {
        for (let i of [this._action, this._reaction]) {
            if (!i.ref.serviceName)
                continue
            i.token = await db.getToken(accountMail, i.ref.serviceName)
        }
    }

    public start() {
        this._action.ref.start((properties) => {
            this._reaction.ref.launch(this._reaction.params,
                this._reaction.token || '')
        }, this._action.params, this._action.token || '')
    }

    public destroy() {
        this._action.ref.stop()
    }
}