const config = require('.')

module.exports = {
  openapi: '3.0.0', //swagger version, do not change
  info: {
    title: config.api.applicationName + '-V1 (' + config.api.environment + ')',
    version: config.api.version,
    description: config.api.environment.toUpperCase(),
    termsOfService: 'https://localhost:3000/v1/users/userterms',
    contact: {
      email: 'help@dionei.com.br'
    }
  },
  servers: [
    {
      url: '/v1'
    }
  ],
  apis: [
    'src/app/v1/**/*.js',
    // 'src/**/*.yml' //Diretório de schemas
  ],
  tags: [
    {
      name: 'user',
      description: 'API Template'
    }
  ],
  consumes: ['application/json'],
  produces: ['application/json'],
  tags: [
    {
      name: 'Users', //endpoint name in swagger (not the real endpoint)
      description: 'Users Authentication' //endpoint description
    },
    {
      name: 'Tasks',
      description: 'Tasks (to do, doing, done)'
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