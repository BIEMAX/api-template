const express = require('express')
const router = express.Router()
const config = require('../../../config/index')

module.exports = () => {
  const swaggerUi = require('swagger-ui-express')
  const swaggerJsDocumentation = require('swagger-jsdoc')
  const swaggerDefinitions = require('../../../config/swaggerV1')

  const swaggerOptions = {
    definition: swaggerDefinitions,
    apis: swaggerDefinitions.apis
  }

  const swaggerSpecification = swaggerJsDocumentation(swaggerOptions)

  const options = {
    customSiteTitle: config.api.applicationName,
    customCss: '.swagger-ui .topbar { display: none }',
    //customfavIcon: '/favicon.ico',
    explorer: true,
    filter: true,
    swaggerOptions: {
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
          methodsOrder.indexOf(a.get('method'))
        methodsOrder.indexOf(b.get('method'))

        if (result === 0) {
          result = a.get('path').localeCompare(b.get('path'))
        }

        return result
      }
    }
  }

  router.use('/', swaggerUi.serve)
  router.get('/', swaggerUi.setup(swaggerSpecification, options))

  return router
}