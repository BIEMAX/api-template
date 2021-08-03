const express = require('express')
const router = express.Router()
const config = require('../../../config/index')

module.exports = () => {
  const swaggerUi = require('swagger-ui-express')
  const swaggerJsDocumentation = require('swagger-jsdoc')
  const swaggerDefinitions = require('../../../config/v1/index')

  const swaggerOptions = {
    definition: swaggerDefinitions,
    apis: swaggerDefinitions.apis
  }

  const swaggerSpecification = swaggerJsDocumentation(swaggerOptions)

  const options = {
    customSiteTitle: config.api.applicationName,
    //customCss: '.swagger-ui .topbar { display: none }',
    //customfavIcon: '/favicon.ico',
    explorer: true,
    filter: true,
    swaggerOptions: {
      //https://swagger.io/docs/open-source-tools/swagger-ui/usage/configuration/
      displayRequestDuration: true,
      //filter: false,
      showExtensions: true,
      showCommonExtensions: true,
      displayOperationId: true,
      //urls: [], // list of urls
      docExpansion: 'none',
      apisSorter: 'alpha',
      operationsSorter: (a, b) => {
        let methodsOrder = [
          'post',
          'put',
          'patch',
          'delete',
          'get',
          'options',
          'trace'
        ]
        let result =
          methodsOrder.indexOf(a.get('method')) -
          methodsOrder.indexOf(b.get('method'))

        if (result === 0) {
          result = a.get('path').localeCompare(b.get('path'))
        }

        return result
      }
    }
  }

  //TODO: #10 Check if this configuration can create other issues (during the requests)
  //https://github.com/scottie1984/swagger-ui-express/issues/166
  // router.use('/', swaggerUi.serve)
  // router.get('/', swaggerUi.setup(swaggerSpecification, options))
  router.use('/', swaggerUi.serveFiles(swaggerSpecification), swaggerUi.setup(swaggerSpecification, options))

  return router
}