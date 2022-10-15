import passport from "passport"

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

export class Area<ActionParams, ReactionParams> {
    private _action: Action
 
    constructor(
        action: Action,
        actionParams: ActionParams,
        reaction: Reaction,
        reactionParams: ReactionParams,
        serviceToken: string // Temporary, this will be replaced by account mail when db is up
    ) {
        action.start((properties) => {
            reaction.launch(reactionParams == null ? properties : reactionParams, serviceToken)
        }, actionParams, serviceToken)
    }

    public destroy() {
        this._action.stop()
    }
}