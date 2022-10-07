import passport from "passport"

interface Action<ParamType> {
    params: ParamType,
    properties: Map<string, string>
}

interface Reaction<ParamType> {
    params: ParamType,
    properties: Map<string, string>
}

export interface Service {
    start: Function,
    strategy: passport.Strategy,
    actions: Map<string, Action<any>>,
    reactions: Map<string, Reaction<any>>
}