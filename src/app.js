// Custom configurations packages
require('dotenv').config()
const express = require('express')
const app = express()
const config = require('./config')
const cors = require('cors')
const moment = require('moment')
const morgan = require('morgan')
const bodyParser = require('body-parser')
//const { initialize } = require('./libs/authentication')

const i18n = require('i18n')
const configI18n = require('./config/i18n')

// Definitions/Custom settings/Middle wares
app.set('view engine', 'ejs')
app.use(morgan('dev'))
app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))

// Cors configuration
app.use(cors())
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')
  res.setHeader('Access-Control-Allow-Credentials', true)

  next()
})

//Passport authentication with JWT
//TODO: End the implementation of JWT Passport.
//app.use(initialize())

i18n.configure(configI18n)
i18n.setLocale(config.api.language)
const { translate } = require('./libs/library')

// Public path
app.use(express.static('public'))

// Routes/endpoints (each version will be a new line)
require('./routes/v1/index')(app)
require('./routes/v2/index')(app)

// Error no unknown routes
app.use(function (req, res) {
  res.status(404).json({
    // status: false,
    message: translate('init.notFound')
  })
})

// Error Handler/Custom error json
app.use(function (err, req, res, next) {
  let customError = require('./libs/customError')
  let error = customError(err, next)

  res.status(error.status).json({
    status: false,
    message: error.message,
    code: error.code,
    callType: error.syscall,
    lineError: error.lineError,
    timestamp: moment().format('YYYY-MM-DD HH:MM:SS:00-03:00')
  })

})

//Check if has an environment file
if (!process.env.ENVIRONMENT) {
  console.log('-------------------------------------------------------------------------------------------------')
  console.log(`\u001b[${33}m
    Could not identified a 'environment configuration file' on this api server.
    Copy the file '.env.example' and renamed to '.env'. 
    ${Date()} 
    \u001b[0m`)
  console.log('-------------------------------------------------------------------------------------------------')
}
else {
  app
    .listen(config.api.port, function () {
      console.log('-------------------------------------------------------------------------------------------------')
      console.log(`\u001b[${32}m${translate('init.serverStartSuccess')} ${config.api.port} ${translate('init.in')} ${Date()} \u001b[0m`)
      console.log('-------------------------------------------------------------------------------------------------')
    })
    .on('error', function (error) {
      console.log('-------------------------------------------------------------------------------------------------')
      console.log(`\u001b[${31}m${translate('init.serverStartError')} '${error}' ${translate('init.in')} ${Date()} \u001b[0m`)
      console.log('-------------------------------------------------------------------------------------------------')
    })
}

module.exports = app