const OAuthStrategy = require('passport-oauth1')
var InternalOAuthError = require("passport-oauth1").InternalOAuthError

const defaultOptions = {
    requestTokenURL: 'https://trello.com/1/OAuthGetRequestToken',
    accessTokenURL: 'https://trello.com/1/OAuthGetAccessToken',
    userAuthorizationURL: 'https://trello.com/1/OAuthAuthorizeToken',
    profileURL: 'https://trello.com/1/members/me',
    sessionKey: 'oauth:trello',
}

class TrelloStrategy extends OAuthStrategy {
    name = 'trello'
    options: any

    constructor(passedOptions: any, verify: any) {
        const options = Object.assign(defaultOptions, passedOptions || {})
        super(options, verify)
        this.options = options
    }

    userProfile(token: any, tokenSecret: any, params: any, done: any) {
        this._oauth.get(this.options.profileURL, token, tokenSecret, (err: any, body: any, res: any) => {
            if (err) {
                return done(new InternalOAuthError('failed to fetch user profile', err))
            }

            try {
                var json = JSON.parse(body)
                var profile: any = {
                    provider: 'trello'
                }
                profile.id = json.id
                profile.displayName = json.fullName
                profile.emails = [{
                    value: json.email,
                    type: 'work'
                }]
                if (this.options.trelloParams.state != undefined) {
                    profile.state = this.options.trelloParams.state
                }
                profile._raw = body
                profile._json = json

                done(null, profile)
            } catch (e) {
                done(e)
            }
        })
    }

    userAuthorizationParams(passedOptions: any) {
        const options = Object.assign(this.options.trelloParams || {}, passedOptions || {})
        if (options.scope && Array.isArray(options.scope)) {
            options.scope = options.scope.join(',')
        }
        return options
    }
}

export default TrelloStrategy