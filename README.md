# AREA

## BACK-END Rest API Documentation

### Introduction

The API have two sides:
  - Authentication system:
    It handles basic accounts gesture.
  - Services system
    This part deal with many services like twitter, Valorant or instagram.
    It handles Custom Action/Reaction system, including his creation and his interactions with running instances.

### Authentication

#### Basic description

This API Works With a postgres database, and have a JWT system to authorize connected accounts.

#### Routes

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

Every other enpoints needs the JWT in the header (user must be authentified):
  `Authorization: Bearer <token>`

`/auth/unregister`: *DELETE Method*:
- **Response**:
  - 200
  
### Services system

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

Exemple: You want to instanciate an AREA that send a tweet "I made a top 1 on fortnite, add me: <FortniteUsername>" when you made a top on fortnite.

The AREA is:
  - `action`: A fortnite game is made by a user
    - with `parameters`: 
      `username`: The fortnite username
    - `condition`
