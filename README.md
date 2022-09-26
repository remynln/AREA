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
