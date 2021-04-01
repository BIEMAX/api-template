//const bullBoard = require('bull-board') //Only used for queues
const config = require('../config/index')

/**
 * Create api routes for Version 1
 * @param {*} app 
 */
module.exports = (app) => {
  app.use('/v1/users', require('../app/v1/users')(app))
  app.use('/v1/tasks', require('../app/v1/tasks')(app))

  if (config.api.showDocumentation) {
    app.use('/v1/api', require('../app/v1/apidoc')(app))
    app.use('/v1', require('../app/v1/apidoc')(app)) //main route
  }
}