const config = require('../config/index')

/**
 * Allow to work with the following strategies to authentication: Basic & Digest, OpenID, OAuth, OAuth 2.0 and JWT.
 */
const passport = require('passport')
/**
 * Import module to authenticate using passport-jwt
 */
const passportJWT = require('passport-jwt')
const ExtractJwt = passportJWT.ExtractJwt
const Strategy = passportJWT.Strategy;
const HeaderAPIKeyStrategy = require('passport-headerapikey').HeaderAPIKeyStrategy

/**
 * Initialize the validation for check security in requests (using Api-Key or Bearer-Key)
 */
module.exports.initialize = () => {

  var strategy = new Strategy(
    {
      secretOrKey: config.security.secretKey,
      jwtFromRequest: ExtractJwt.fromAuthHeader()
    },
    (payload, done) => {
      //If allow, just say that it's ok
      if (config.security.canAllowNonSecureRequests) {
        return done(null, { id: '-1', message: 'canAllowNonSecureRequests is defined as true' })
      }
      //If not check api-key in database, will check on array in config file
      else if (!config.security.shouldValidateApiKeyInDatabase) {
        var user = config.security.apiKeys.filter(item => item.key === payload.id)
      }
      else {
        //TODO: Implement logic to validate api key on database queries,.//.
        var user = users[payload.id] || null;
        if (user) {
          return done(null, { id: user.id });
        } else {
          return done(new Error("User not found"), null);
        }
      }
    }
  );
  passport.use(strategy);
  return passport.initialize()
}