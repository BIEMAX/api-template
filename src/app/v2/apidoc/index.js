const express = require('express')
const router = express.Router()
const config = require('../../../config/index')

module.exports = () => {
  const swaggerUi = require('swagger-ui-express')
  const swaggerJSDoc = require('swagger-jsdoc')
  const apiJsonV2 = require('../../../config/v2/index')

  //Generate JSDoc from custom json
  const swaggerDocumentsSpecification = swaggerJSDoc({
    apis: apiJsonV2.apis,
    definition: apiJsonV2
  })

  const customOptions = {
    customSiteTitle: config.api.applicationName,
    customCss: '.swagger-ui .topbar { display: none }',
    //customfavIcon: '/favicon.ico',
    swaggerUrl: apiJsonV2,
    explorer: false,
    filter: true,
    swaggerOptions: {
      //https://swagger.io/docs/open-source-tools/swagger-ui/usage/configuration/
      displayRequestDuration: true,
      filter: true,
      showExtensions: true,
      showCommonExtensions: true,
      displayOperationId: true,
      docExpansion: 'none', //Define if the documentation already start expanded || //Controls the default expansion setting for the operations and tags. It can be 'list' (expands only the tags), 'full' (expands the tags and operations) or 'none' (expands nothing).
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

  router.use('/', swaggerUi.serve)
  router.get('/', swaggerUi.setup(swaggerDocumentsSpecification, customOptions, null, null, null, null, config.api.applicationName))

  return router
}