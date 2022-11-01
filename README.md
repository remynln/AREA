# AREA

## BACK-END Rest API Documentation

### Introduction

The API has two sides:
  - Authentication system:
    It handles basic accounts gesture.
  - Services system:
    This part deal with many services like twitter, Valorant or instagram.
    It handles Custom Action/Reaction system, including his creation and his interactions with running instances.

### Authentication

#### Basic description

This API Works With a postgres database, and have a JWT system to authorize connected accounts.

### Classic authentication system

##### Routes

`/auth/register`: *POST Method*
- **Request Body**:
  - `email`: email of the user
  - `username`: name of the user
  - `password`: password selected by the user
- **Response**:
  - 201 ->
    - `token`: JWT for authorization
- **Error Responses**:
  - 409: e-mail or username already exists in our database

`/auth/login`: *POST Method*:
- **Request Body**:
  - `email`: email of the user
  - `password`: password of the user
- **Response**:
  - 200 ->
    - `token`: JWT for authorization
- **Error Responses**:
  - 403: Username or password is incorrect

Every others endpoints need the JWT in the header (user must be authentified):
  `Authorization: Bearer <token>`

`/auth/unregister`: *DELETE Method*:
- **Response**:
  - 200
  
### Service OAuth2 Authentication

Oauth2 system is useful to enrich an account with services like Google, twitter, microsoft etc...
Accounts are linked by their mails, if you connect with the google service, it will create a classic account with the mail associated with google, but will save the api token to unlock AREAS action and reactions linked to this service.

#### Routes

`/service/[service_name]`: *GET Method*
- **Request Body**:
  - `callback`: The url to redirect after authentication
- **Response**:
  - callback url redirection with body ->
    - `token`: JWT for authorization

#### Available services
  - `google`

### AREA system

#### Basic description

There are multiple services, identifiable by their `name`.
The principles of the service system is to instanciate **AREAS**: an AREA is an **Action** done by a third-party **Service** that triggers **Reactions** automatically done by another third-party **Service** when a set of **Conditions** is respected

#### Service description

Each service have:
  - **Actions**: It's the different actions done by the service and detectable by our web server. For example, a disponible action for the service "twitter" is: A new tweet is posted by a specific user. A user instanciate actions by setting **parameters**, with the example above, `sender` is a parameter that describe the target user to track his tweets. Each actions have a set of **properties** related to it, it will be explained later.
  - **Reactions**: It's the different actions that can be done using the service, and can be triggered by our web server. For example, a disponible action for the twitter service is: Tweet something. Like Actions, Reactions have a set of **parameters**. with the example, the paremeters will be `tweet_title`, `tweet_content`.
  - **Properties**: Properties of a service are informations that can be get by calling the service's api. For example you can get the biography of a tweetos with `Twitter:biography(userID)`.

#### AREA Description

An AREA have:
  - `user`: The user that instanciated the AREA
  - `action`: The service's Action that will trigger the reaction and his parameters
  - `condition` (optional): a condition set using **properties** to trigger or not 
  - `reaction`: The service's Reaction to the action and his parameters

Exemple: You want to instanciate an AREA that send a tweet "I made a top 1 on fortnite, add me: \<FortniteUsername\>" when you made a top on fortnite.

The AREA is:
  - `action`:  Fortnite service -> a game is launched by a user is over
    - with `parameters`: 
      `username`: The fortnite username
  - `condition`: `[Action:rank]` == 1
  - `reaction`: Tweeter service -> tweet something
    - with `parameters`:
      - `title`: "Another top 1"
      - `content`: "I made a top 1 on fortnite, add me: `[Action:FortniteUsername]`"
      
 #### Endpoints
 
`/area/create`: *POST Method*
- **Request Body**:
  - `action`:
    - `name`: `[service_name]/[action_name]` 
    - `params`: the params of the action (in JSON), depending on the actions
- `condition`: string with `condition` format (explained later)
- `reaction`:
    - `name`: `[service_name]/[action_name]`
    - `params`: the params of the action (in JSON), depending on the actions
- **Response**:
  - 201 -> OK
  - 403 -> Needs an authentication to a service concerned by actions or reactions

In order to do create an area correctly without doing a bad request: you can request some informations about available services actions reaction and their params

`/services/` *GET Method*
- **Response**:
  - 200 ->
    - `connected`: [list of services that the user is connected to]
    - `not_connected`: [list of available services that the user is not connected to]

`/service/[service_name]/actions`: *GET Method*
- **Response**:
  - 200 ->
    - [list of available actions { `name`, `description` }]
  - 404 -> Service with name [service_name] not found

`/service/[service_name]/action/[action_name]`: *GET Method*
- **Response**:
  - 200 ->
    - `parameters`: [list of parameters]
    - `properties`: [list of available properties]
  - 404 -> Service with name [service_name] not found
  - 404 -> Action [action_name] not found

`/service/[service_name]/reactions`: *GET Method*
- **Response**:
  - 200 ->
    - [list of available reactions { `name`, `description` } ]
  - 404 -> Service with name \[service_name] not found

`/service/[service_name]/reaction/[reaction_name]`: *GET Method*
- **Response**:
  - 200 ->
    - `properties`: [list of available properties]
  - 404 -> Service with name `service_name` not found
  - 404 -> Reaction `reaction_name` not found

#### Properties formatting

Action properties can be used in reaction parameters by calling `[Action.property]`.
For example, when using action gmail/newMail, you can type `[Action.from.email]` to get action mail.
If you want to use`[` character in your body, you have to write `\[`.

#### Condition format

condition is formatted like every basic programming language.

You can compare properties of type number using comparisons operators: `>`, `<`, `<=`, `>=`, `==`
You can compare properties of type string using operators: `==` (case insensitive comparison), `===` (case sensitive comparison), `in` (leftstring is a substring of rightstring exemple: `"can" in "you can do it"` is true)

### User gesture
Every routes in this categry have a `[user_id]` parameter, this param is an hexadecimal value, accessible only by admin users.
But [user_id] can also be set to `me`, this will reffer to the currently connected account (with jwt token passed in header), and many routes can be accessed without being an admin with the `me` parameter.

#### Admin
There is one superuser, with username "root", this is the only user that can set other users to administrators.<br />
there is as many as superuser the superuser wants to set.<br />
admins can't affect other admin accounts.<br />
