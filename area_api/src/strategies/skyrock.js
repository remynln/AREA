const { OAuth } = require('oauth');

// Load modules.
var OAuthStrategy = require('passport-oauth1')
  , util = require('util')
  , uri = require('url')
  , XML = require('xtraverse')
  , InternalOAuthError = require('passport-oauth1').InternalOAuthError


/**
 * `Strategy` constructor.
 *
 * The Twitter authentication strategy authenticates requests by delegating to
 * Twitter using the OAuth protocol.
 *
 * Applications must supply a `verify` callback which accepts a `token`,
 * `tokenSecret` and service-specific `profile`, and then calls the `cb`
 * callback supplying a `user`, which should be set to `false` if the
 * credentials are not valid.  If an exception occured, `err` should be set.
 *
 * Options:
 *   - `consumerKey`     identifies client to Twitter
 *   - `consumerSecret`  secret used to establish ownership of the consumer key
 *   - `callbackURL`     URL to which Twitter will redirect the user after obtaining authorization
 *
 * Examples:
 *
 *     passport.use(new TwitterStrategy({
 *         consumerKey: '123-456-789',
 *         consumerSecret: 'shhh-its-a-secret'
 *         callbackURL: 'https://www.example.net/auth/twitter/callback'
 *       },
 *       function(token, tokenSecret, profile, cb) {
 *         User.findOrCreate(..., function (err, user) {
 *           cb(err, user);
 *         });
 *       }
 *     ));
 *
 * @constructor
 * @param {object} options
 * @param {function} verify
 * @access public
 */
function Strategy(options, verify) {
  options = options || {};
  options.requestTokenURL = options.requestTokenURL || 'https://api.skyrock.com/v2/oauth/initiate';
  options.accessTokenURL = options.accessTokenURL || 'https://api.skyrock.com/v2/oauth/token';
  options.userAuthorizationURL = options.userAuthorizationURL || 'https://api.skyrock.com/v2/oauth/authorize';
  options.sessionKey = options.sessionKey || 'oauth:twitter';
  
  OAuthStrategy.call(this, options, verify);
  this.name = 'skyrock';
  this._userProfileURL = options.userProfileURL || 'https://api.skyrock.com/v2/user/get.json';
  this._skipExtendedUserProfile = (options.skipExtendedUserProfile !== undefined) ? options.skipExtendedUserProfile : false;
  this._includeEmail = (options.includeEmail !== undefined) ? options.includeEmail : false;
  this._includeStatus = (options.includeStatus !== undefined) ? options.includeStatus : true;
  this._includeEntities = (options.includeEntities !== undefined) ? options.includeEntities : true;
}

// Inherit from `OAuthStrategy`.
util.inherits(Strategy, OAuthStrategy);


/**
 * Authenticate request by delegating to Twitter using OAuth.
 *
 * @param {http.IncomingMessage} req
 * @param {object} [options]
 * @access protected
 */
Strategy.prototype.authenticate = function(req, options) {
  // When a user denies authorization on Twitter, they are presented with a link
  // to return to the application in the following format (where xxx is the
  // value of the request token):
  //
  //     http://www.example.com/auth/twitter/callback?denied=xxx
  //
  // Following the link back to the application is interpreted as an
  // authentication failure.
  if (req.query && req.query.denied) {
    return this.fail();
  }
  
  // Call the base class for standard OAuth authentication.
  OAuthStrategy.prototype.authenticate.call(this, req, options);
};

/**
 * Retrieve user profile from Twitter.
 *
 * This function constructs a normalized profile, with the following properties:
 *
 *   - `id`        (equivalent to `user_id`)
 *   - `username`  (equivalent to `screen_name`)
 *
 * Note that because Twitter supplies basic profile information in query
 * parameters when redirecting back to the application, loading of Twitter
 * profiles *does not* result in an additional HTTP request, when the
 * `skipExtendedUserProfile` option is enabled.
 *
 * @param {string} token
 * @param {string} tokenSecret
 * @param {object} params
 * @param {function} done
 * @access protected
 */
Strategy.prototype.userProfile = function(token, tokenSecret, params, done) {
  done(null, {})
};

/**
 * Return extra Twitter-specific parameters to be included in the user
 * authorization request.
 *
 * @param {object} options
 * @return {object}
 * @access protected
 */
Strategy.prototype.userAuthorizationParams = function(options) {
  var params = {};
  if (options.forceLogin) {
    params.force_login = options.forceLogin;
  }
  if (options.screenName) {
    params.screen_name = options.screenName;
  }
  return params;
};

/**
 * Parse error response from Twitter OAuth endpoint.
 *
 * @param {string} body
 * @param {number} status
 * @return {Error}
 * @access protected
 */
Strategy.prototype.parseErrorResponse = function(body, status) {
  var json, xml;
  
  try {
    json = JSON.parse(body);
    if (Array.isArray(json.errors) && json.errors.length > 0) {
      return new Error(json.errors[0].message);
    }
  } catch (ex) {
    xml = XML(body)
    return new Error(xml.children('error').t() || body);
  }
};


// Expose constructor.
module.exports = Strategy;
