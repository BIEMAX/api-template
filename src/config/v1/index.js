const config = require('../index')
const { translate } = require('../../libs/library')

/**
 * Contains swagger definitions (like servers, version, name, environment, routes).
 */
module.exports = {
  openapi: '3.0.0', //do not change
  info: {
    title: `${config.api.applicationName} - V1 (${config.api.environment})`,
    version: config.api.version,
    description: config.api.environment.toUpperCase(),
    termsOfService: 'https://localhost:3000/v1/users/userterms',
    contact: {
      email: 'help@dionei.com.br'
    }
  },
  servers: [
    {
      url: '/v1',
      description: 'Current server'
    },
    {
      url: 'https://yourserver.com',
      description: 'Production Server'
    },
    {
      url: 'https://acceptance.yourserver.com',
      description: 'Acceptance'
    },
    {
      url: 'https://testing.yourserver.com',
      description: 'Testing'
    },
    {
      url: 'https://dev.yourserver.com',
      description: 'Development'
    }
  ],
  schemes: [
    'https',
    'http'
  ],
  apis: [
    'src/app/v1/**/*.js',
    // 'src/**/*.yml' //Schemas directory
  ],
  consumes: ['application/json'],
  produces: ['application/json'],
  tags: [
    {
      name: translate('routes.v1.users.title'), //endpoint name in swagger (not the real endpoint)
      description: translate('routes.v1.users.description') //endpoint description
    },
    {
      name: translate('routes.v1.tasks.title'),
      description: translate('routes.v1.tasks.description')
    },
  ],
  components: {
    securitySchemes: {
      Apikey: {
        type: 'apiKey',
        description: 'Api-Key Authentication',
        name: 'authorization',
        in: 'header',
        schemes: ['http', 'https']
      },
      Bearer: {
        type: 'apiKey',
        description: 'Bearer Authentication',
        name: 'authorization',
        in: 'header',
        schemes: ['http', 'https']
      }
    }
  }
}