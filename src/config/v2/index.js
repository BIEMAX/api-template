const config = require('../index')
const { translate } = require('../../libs/library')

/**
 * Contains swagger definitions (like servers, version, name, environment, routes).
 */
module.exports = {
  openapi: '3.0.0', //do not change
  info: {
    title: `${config.api.applicationName} - V2 (${config.api.environment})`,
    version: config.api.version,
    description: config.api.environment.toUpperCase(),
    termsOfService: 'https://localhost:3000/v2/users/userterms',
    contact: {
      email: 'help@dionei.com.br'
    }
  },
  servers: [
    {
      url: '/v2',
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
    'src/app/v2/**/*.js',
    // 'src/**/*.yml' //Schemas directory
  ],
  consumes: ['application/json'],
  produces: ['application/json'],
  tags: [
    {
      name: 'UsersAuth', //endpoint name in swagger (not the real endpoint)
      description: 'Users Authentication' //endpoint description
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