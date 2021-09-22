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

  //For 'customOptions.swaggerOptions' definitions, read the documentation in the following link:
  //https://swagger.io/docs/open-source-tools/swagger-ui/usage/configuration/

  const customOptions = {
    customSiteTitle: config.api.applicationName,
    customCss: '.swagger-ui .topbar { display: none }',
    //customfavIcon: '/favicon.ico',
    swaggerUrl: apiJsonV2,
    explorer: false,
    filter: true,
    swaggerOptions: {
      deepLinking: false,
      displayOperationId: true,
      defaultModelsExpandDepth: -1,
      defaultModelExpandDepth: 1,
      //defaultModelRendering: 'model',
      displayRequestDuration: true,
      docExpansion: 'none', //'list', 'full' or 'none'
      filter: true,
      maxDisplayedTags: 0,
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
        let result = methodsOrder.indexOf(a.get('method')) - methodsOrder.indexOf(b.get('method'))

        if (result === 0) result = a.get('path').localeCompare(b.get('path'))
        return result
      },
      showExtensions: true,
      showCommonExtensions: true,
      //tagsSorter: '',
      useUnsafeMarkdown: false,
      //onComplete: '',
      syntaxHighlight: {
        activate: false,
        theme: '', //String=["agate" *, "arta", "monokai", "nord", "obsidian", "tomorrow-night"].Highlight.js syntax coloring theme to use. (Only these 6 styles are available.)
      },
      tryItOutEnabled: true,
      //requestSnippets: '',
      apisSorter: 'alpha',
    }
  }

  router.use('/', swaggerUi.serveFiles(swaggerDocumentsSpecification, customOptions))
  router.get('/', swaggerUi.setup(swaggerDocumentsSpecification, customOptions, null, null, null, null, config.api.applicationName))

  return router
}