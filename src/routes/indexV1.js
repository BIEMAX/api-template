//const bullBoard = require('bull-board') //Only used for queues

/**
 * Create api routes for Version 1
 * @param {*} app 
 */
module.exports = (app) => {
  app.use('/v1/users', require('../app/v1/users')(app))

  app.use('/v1/api', require('../app/v1/apidoc')(app))
  app.use('/v1', require('../app/v1/apidoc')(app)) //main route
}