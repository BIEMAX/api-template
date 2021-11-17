'use strict'

const { config } = require('../libs/library')
const path = require('path')

module.exports = {
  locales: [
    'en-US',
    'pt-BR'
  ],
  defaultLocale: config.api.language,
  directory: path.join(__dirname, '../locales'),
  cookie: `${config.api.applicationName}-i18n`,
  objectNotation: true,
  updateFiles: false,
  autoReload: true,
  register: global
}