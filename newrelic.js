'use strict'

const config = require('./src/config/index')
//const applicationName = require('./src/lib/newRelicAppName')

exports.config = {
  //app_name: [nomeLog().toString()],
  app_name: config.api.applicationName,
  license_key: config.apm.newRelic.apiKey,
  logging: {
    level: 'info'
  },
  allow_all_headers: false,
  attributes: {
    exclude: [
      'request.headers.cookie',
      'request.headers.authorization',
      'request.headers.proxyAuthorization',
      'request.headers.setCookie*',
      'request.headers.x*',
      'response.headers.cookie',
      'response.headers.authorization',
      'response.headers.proxyAuthorization',
      'response.headers.setCookie*',
      'response.headers.x*'
    ]
  },
  slowSql: true
}