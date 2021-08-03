const config = require('../index')
const { translate } = require('../../libs/library')

/**
 * Contains swagger definitions (like servers, version, name, environment, routes).
 */
module.exports = {
  openapi: '3.0.3',
  info: {
    title: `${config.api.applicationName} - V2 (${config.api.environment})`,
    version: config.api.version,
    description: config.api.environment.toUpperCase(),
    termsOfService: 'https://localhost:3000/v2/users/userterms',
    contact: {
      name: 'API Support',
      email: 'help@dionei.com.br',
      url: 'https://help.api.com'
    },
    license: {
      name: 'Apache 2.0',
      url: 'https://www.apache.org/licenses/LICENSE-2.0.html'
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