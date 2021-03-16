const config = require('./indexV1')

module.exports = {
  openapi: '3.0.0', //swagger version, do not change
  info: {
    title: config.api.applicationName + ' (' + config.api.environment + ')',
    version: config.api.version,
    description: config.api.environment.toUpperCase(),
    termsOfService: 'https://localhost:3000/termos_usu',
    contact: {
      email: 'help@dionei.com.br'
    }
  },
  servers: [
    {
      url: '/v1'
    }
  ],
  apis: ['src/**/*.js', 'src/**/*.yml'],
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
      name: 'usuario',
      description: 'Users - Users Authentication'
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