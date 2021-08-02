const config = require('../../config/index')

/**
 * Create api routes for Version 1
 * @param {*} app 
 */
module.exports = (app) => {
  if (config.api.showDocumentation == 'true') {
    app.use('/v2/api', require('../../app/v2/apidoc')(app))
    app.use('/v2', require('../../app/v2/apidoc')(app)) //main route
  }

  app.use('/v2/users', require('../../app/v2/users')(app))
  //app.use('/v1/tasks', require('../../app/v2/tasks')(app))
}