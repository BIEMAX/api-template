'use strict'

const waterfall = require('./waterfall')
const moment = require('moment')
const config = require('../config/index')
const newRelic = require('./newRelic')
const sqlFile = require('./sqlFile')

const i18n = require('i18n')
const translate = i18n.__

/**
 * Module that exports default libraries (common used in import)
 */
module.exports = { waterfall, moment, config, translate, newRelic, sqlFile }