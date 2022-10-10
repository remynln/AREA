import passport from "passport"

export interface Action<ParamType, PropertiesType> {
    start: (
        trigger: (properties: PropertiesType) => void,
        params: ParamType,
        token: string
    ) => void,
    stop: () => void
    destroy: () => void
}

export interface Reaction<ParamType> {
    launch: (params: ParamType) => void
}

export interface Service {
    start: Function,
    strategy: passport.Strategy,
    actions: Map<string, Action<any, any>>,
    reactions: Map<string, Reaction<any>>

    [x: string | number | symbol]: unknown;
}

export class Area<ActionParams, ReactionParams> {
    private _action: Action<ActionParams, any>
 
    constructor(
        action: Action<ActionParams, any>,
        actionParams: ActionParams,
        reaction: Reaction<ReactionParams>,
        reactionParams: ReactionParams,
        serviceToken: string // Temporary, this will be replaced by account mail when db is up
    ) {
        action.start((properties) => {
            reaction.launch(reactionParams == null ? properties : reactionParams)
        }, actionParams, serviceToken)
    }

    public destroy() {
        this._action.stop()
    }
}