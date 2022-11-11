import { Strategy as PassportStrategy } from "passport"
import https from "https"
import axios from "axios"

export interface GeniusVerifyCallback {
    (
      req: any, // req,
      accessToken: string, // oauthData.access_token,
      _unknown: undefined, // ? undefined,
    userProfileData: any,
      callback: (err: Error | undefined, user: any, info: unknown) => void
    ): void
}

export interface GeniusStrategyOptions {
    clientID: string
    clientSecret: string
    callbackURL: string
    tokenURL?: string
    authorizationURL?: string
    state?: string,
    scope?: string[]
}
  

export default class Strategy extends PassportStrategy {
    name: string
    private _verify: GeniusVerifyCallback
    private _options: GeniusStrategyOptions
    private _clientSecret: string
    private _clientID: string
    private _tokenURL: string
    private _authorizationURL: string

    constructor(options: GeniusStrategyOptions, verify: GeniusVerifyCallback) {
        super()
        if (!verify) {
          throw new TypeError("GeniusStrategy requires a verify callback")
        }
        if (!options.clientID) {
          throw new TypeError("GeniusStrategy requires a clientID")
        }
        if (!options.clientSecret) {
          throw new TypeError("GeniusStrategy requires a clientSecret")
        }
        if (!options.callbackURL) {
          throw new TypeError("GeniusStrategy require an Callback URL option")
        }

        this.name = "genius"
        this._verify = verify
        this._options = options
        this._clientSecret = options.clientSecret
        this._clientID = options.clientID
        this._tokenURL = options.tokenURL || "https://api.genius.com/oauth/token"
        this._authorizationURL = options.authorizationURL || "https://api.genius.com/oauth/authorize"
    }

    async authenticate(
        req: Parameters<PassportStrategy["authenticate"]>[0],
        options: Parameters<PassportStrategy["authenticate"]>[1]
      ) {
        options = options || {}
        if (req.query && req.query.code) {
          try {
            const oauthData = await this.getOAuthAccessToken(req.query.code as string)
            //if (oauthData.owner.type !== "user") {
            //  throw new Error(`Genius API token not owned by user, instead: ${oauthData.owner.type}`)
            //}
            let res = await axios.get("http://api.genius.com/account", {
              headers: {
                "Authorization": "Bearer " + oauthData.access_token
              }
            })

            this._verify(
              req,
              oauthData.access_token,
              undefined,
              res.data.response.user,
              (err, user, info) => {
                if (err) return this.error(err)
                if (!user) return this.fail(info as any /* ??? */)
                this.success(user)
              }
            )
          } catch (error: any) {
            this.error(error as Error)
          }
        } else {
          const authUrl = new URL(this._authorizationURL)
          authUrl.searchParams.set("client_id", this._clientID)
          authUrl.searchParams.set("redirect_uri", this._options.callbackURL)
          authUrl.searchParams.set("response_type", "code")
          if (this._options?.state) {
            authUrl.searchParams.set("state", this._options.state)
          } else if (options.state) {
            authUrl.searchParams.set("state", options.state)
          }
          if (this._options?.scope)
            authUrl.searchParams.set("scope", this._options.scope.join(' '))
          const location = authUrl.toString()
          this.redirect(location)
        }
      }
      async getOAuthAccessToken(code: string): Promise<any> {
        let accessTokenURLObject = new URL(this._tokenURL)
    
        const accessTokenBody = {
          grant_type: "authorization_code",
          code,
          redirect_uri: this._options.callbackURL,
        }
    
        const encodedCredential = Buffer.from(`${this._clientID}:${this._clientSecret}`).toString(
          "base64"
        )
    
        const requestOptions = {
          hostname: accessTokenURLObject.hostname,
          path: accessTokenURLObject.pathname,
          headers: {
            Authorization: `Basic ${encodedCredential}`,
            "Content-Type": "application/json",
          },
          method: "POST",
        }
    
        return new Promise<any>((resolve, reject) => {
          const accessTokenRequest = https.request(requestOptions, (res) => {
            let data = ""
            res.on("data", (d) => {
              data += d
            })
    
            res.on("end", () => {
              try {
                resolve(JSON.parse(data))
              } catch (error) {
                reject(error)
              }
            })
          })
    
          accessTokenRequest.on("error", reject)
          accessTokenRequest.write(JSON.stringify(accessTokenBody))
          accessTokenRequest.end()
        })
      }
}