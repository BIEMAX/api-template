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

// Public path
app.use(express.static('public'))

// Routes/endpoints (each version will be a new line)
require('./routes/indexV1')(app)

// Error no unknown routes
app.use(function (req, res) {
  res.status(404).json({
    // status: false,
    message: 'Endpoint not found. Contact the system administrator for more information;'
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

app
  .listen(config.api.port, function () {
    console.log('-------------------------------------------------------------------------------------------------')
    console.log(`\u001b[${32}mAPI server started in port ${config.api.port} in ${Date()} \u001b[0m`)
    console.log('-------------------------------------------------------------------------------------------------')
  })
  .on('error', function (error) {
    console.log('-------------------------------------------------------------------------------------------------')
    console.log(`\u001b[${31}mAPI server cannot be started by: '${error}' in ${Date()} \u001b[0m`)
    console.log('-------------------------------------------------------------------------------------------------')
  })

module.exports = app