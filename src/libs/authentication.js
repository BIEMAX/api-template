const { config, translate } = require('./library')

/**
 * Allow to work with the following strategies to authentication: Basic & Digest, OpenID, OAuth, OAuth 2.0 and JWT.
 */
const passport = require('passport')
/**
 * Import module to authenticate using passport-jwt
 */
const passportJWT = require('passport-jwt')
const ExtractJwt = passportJWT.ExtractJwt
const Strategy = passportJWT.Strategy
const HeaderAPIKeyStrategy = require('passport-headerapikey').HeaderAPIKeyStrategy

/**
 * Initialize the validation for check security in requests (using Api-Key or Bearer-Key)
 */
module.exports.initialize = () => {

  var strategyForBearerKey = new Strategy(
    {
      secretOrKey: config.security.secretKey,
      jwtFromRequest: ExtractJwt.fromAuthHeader()
    },
    (payload, done) => {
      //TODO: Implement logic to validate bearer key's in database through queries.
      //return done(null, payload)

      //If allow, just say that it's ok
      if (config.security.canAllowNonSecureRequests) {
        return done(null, { id: '-1', message: translate('lib.auth.allow') })
      }
      //If not check api-key in database, will check on array in config file
      else if (!config.security.shouldValidateApiKeyInDatabase) {
        var user = config.security.apiKeys.filter(item => item.key === payload.id)
        return done(null, user)
      }
      else {
        var user = users[payload.id] || null
        if (user) {
          return done(null, { id: user.id })
        } else {
          return done(new Error(translate('lib.auth.notFound')), null)
        }
      }
    }
  )

  var strategyForApiKey = new HeaderAPIKeyStrategy(
    {
      header: 'Authorization',
      prefix: 'Api-Key ',
    },
    true,
    (apikey, done) => {
      // If defined to allow requests without api key, return true.
      if (config.security.canAllowNonSecureRequests) {
        return done(null, apikey)
      }
      // If defined to now allow requests without api key, check if 
      //querie in database or in array in config.
      else if (config.security.shouldValidateApiKeyInDatabase) {
        //TODO: Implement logic to validate api key's in database through queries.
        return done(null, apikey)
        // oracledb
        //   .getConnection(dbConfig)
        //   .then((conn) => {
        //     return conn
        //       .execute('SELECT * FROM usuario WHERE apikey = :apikey', [apikey])
        //       .then((result) => {
        //         if (result.rows.length > 0) {
        //           let apikey = {
        //             usuario: result.rows[0].USUARIO,
        //             scopes: result.rows[0].SCOPES,
        //           }
        //           conn.close()
        //           return done(null, apikey)
        //         } else {
        //           conn.close()
        //           return done(null, false)
        //         }
        //       })
        //       .catch((err) => {
        //         conn.close()
        //         return done(new Error(err), null)
        //       })
        //   })
        //   .catch(() => {
        //     return done(new Error('Serviço indisponível. Tente mais tarde.'), null)
        //   })
      }
      //Validate Api-Key in config array
      else {
        let user = ''
        try {
          user = config.security.apiKeys.filter(item => item.key === apikey && !item.scopes[scope])
          if (user) return done(null, user)
          else return done(null, false)
        }
        catch (err) {
          return done(err, null)
        }
      }
    },
  )

  passport.use(strategyForBearerKey)
  passport.use(strategyForApiKey)

  return passport.initialize()
}

/**
 * Check if the api-key set in header (authorization session) is valid
 * @param {String} scope Scope to check if the Api-Key has permission to request endpoint
 * @returns True if ok, false instead.
 */
module.exports.isAPIKeyAuthenticate = (scope) => {
  return function (req, res, next) {
    return passport.authenticate('headerapikey', { session: false }, function (err, user) {
      if (err) {
        return next(err)
      } else if (!user) {
        err = new Error('Api-Key invalid or empty')
        err.status = 401
        next(err)
      } else {
        if (scope && user && user.scopes) {
          if (user.scopes.indexOf(scope) < 0) {
            err = new Error(`Api-Key used don't have sufficient permissions to access the scope '${scope}'`)
            err.status = 403
          }
        } else {
          req.user = user
        }
        next(err)
      }
    })(req, res, next)
  }
}