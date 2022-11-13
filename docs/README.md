# Implements a new service in Sergify API
## Introduction
Sergify API includes typescript classes and interfaces to implements new services with actions and reactions generically.
Every service can be added with as many as reactions and actions needed
## Create a Service
A new Service is an object that implemnts a `Service` interface:
```
export interface Service {
    strategy: passport.Strategy
    actions: Map<string, ActionConfig>
    reactions: Map<string, ReactionConfig>
    authParams: any
    refreshToken: (refreshToken: string) => Promise<string | null>
    [x: string | number | symbol]: unknown;
}
```

This class have some abstract methods to override.
### Methods and properties to implements
##### `strategy` :
This is the passport strategy to implement authentication to the service.
The callback function of the strategy must return an object containing:
`data:` This must be a unique element from the profile who authenticated
`accessToken`: The service accessToken
`refreshToken`: The service refreshToken
`username`: The username of  the profile who authenticated (useful for tier-service login)

If `req.query.state` includes a space, it means that it contains a token associated with the AREA account, and you must save the token using `db.setToken` to link a service with the account

###### Exemple:
\
```ts
strategy: new DeezerStrategy(
        {
            clientID: process.env.DEEZER_CLIENT_ID,
            clientSecret: process.env.DEEZER_CLIENT_SECRET,
            callbackURL: process.env.DOMAIN + "/service/deezer/callback",
            passReqToCallback: true,
            scope: ["basic_access", "delete_library", "manage_library", "offline_access", "listening_history"]
        },
        (req: any, accessToken: string, refreshToken: string, profile: any, callback: any) => {
            let cbObj: OAuthCallbackObj = {
                data: profile.id.toString(),
                accessToken: accessToken,
                refreshToken: '',
                username: profile.displayName
            }
            let accountToken = req.query.state;
            if (!accountToken || !accountToken.includes(' ')) {
                callback(null, cbObj)
                return
            }
            let mail = (jwt.decode(accountToken.split(' ')[1]) as JwtFormat).email
            db.setToken(accessToken, refreshToken, mail, 'deezer').then(() => {
                callback(null, cbObj)
            }).catch((err) => callback(err))
        }
    ),
    refreshToken: async (refreshToken) => {
        return ''
    }
```
##### `authParams` :

this is an object that contains parameters that have to be passed as Passport.authenticate to make things works (sometimes it is needed by the strategy)

#### `refreshToken` :
This method is called when the access token expired.
This method have to call the service's endpoint to refresh the accessToken from `refreshToken` parameter
Return the new access token or null if the refreshToken expired (this will deconnect the user from the service)

#### `actions`
A map of available actions, their configuration interface associated with their names 

#### `reactions`
A map of available reactions, their configuration interface associated with their names 

### Make it work !
Don't forget to reference your service object in `services` map in `~/core/global.ts`

## Create an Action

### Action config
Each actions implements an interface to inform about general informations

```ts
export interface ActionConfig {
    serviceName: string | null
    name: string
    description: string
    propertiesType: PropertyTypeType
    paramTypes: {[x: string]: string}
    create: ActionConstructor
}
```
###### `serviceName` :
The name of the service associated with the action
###### `name` :
The name of the action
###### `description` :
The description of the action, beginning by "When"
###### `properties type`:
An object that describe the available action's properties,
with their name as key, and type as value (available types are "string" and "number")
You can nest properties objects
###### `param type`:
object containing action's parameters
with parameter name as key, and type as value.
Put a "?" at the end of the type of parameter to set it to optionnal
###### `create`
The class overriding `Action` abstract class that contains code associated to action, 

### Action class
This class is here to deal generically action parameters/properties, informations polling, error handling, and reaction triggering

```ts
export abstract class Action {
    trigger: (properties: any) => void
    refresh: RefreshTokenFunction
    error: (err: Error) => void
    params: any
    token: string
    accountMail: string
    abstract start(): Promise<void>
    abstract stop(): Promise<void>
    abstract loop(): Promise<void>
}
```

#### abstract methods to override

###### `start()` :
This method is called when starting a new area, this allows Action initialisation

###### `stop()`:
This method is called when disabling or deleting an area, this allows to clear action properly

###### `loop()`:
This will be called in loop with a time period depending on how many others areas are active within this service.
This allows information polling to detect if something have happened by requesting endpoints.

#### Methods and properties available in the class

###### `trigger` :
Call this function with action properties as parameters when the reaction needs to be triggered

###### `token` :
This is the service's access token, this allows to request endpoints that needs auth

###### `refresh`:
When requested an endpoint you can use this function to ensure that a valid token will be used by passing the code in the callback function as parameter of `refreshToken` method. Return `AreaRet.AccessTokenExpired` if the request failed because of an expiration of the accessToken, this will automatically refresh the token and call your code again.

###### `error`:
You can safely throw error in the asynchrone context of `loop()` and `start()` theses will be handled by the server.
But sometimes, when using webhooks for example you quit the asynchrone context of this functions and throwing errors will cause a crash, calling the `error` method will safely trace back the error to the backend logs.

###### `params` :
This object mirrors the object `actionConf.parametersType` described earlier with user's custom parameters.
Use this to modify the behavior of the action

###### `accountMail` :
area's account which launched this actions

### Create a reaction

#### Reaction config

Like actions, reactions implements an interface to inform about general informations.

```ts
export abstract class Reaction {
    refresh: RefreshTokenFunction
    token: string
    params: any = undefined
    abstract launch(): Promise<void>
}
```

#### Abstract method to override

###### `launch`:
This function is called to trigger the reaction

#### Methods and properties available in the class



###### `refresh`:
When requested an endpoint you can use this function to ensure that a valid token will be used by passing the code in the callback function as parameter of `refreshToken` method. Return `AreaRet.AccessTokenExpired` if the request failed because of an expiration of the accessToken, this will automatically refresh the token and call your code again.

###### `token` :
This is the service's access token, this allows to request endpoints that needs auth

###### `params` :
This object mirrors the object `reactionConf.parametersType` described earlier with user's custom parameters.
Use this to modify the behavior of the reaction