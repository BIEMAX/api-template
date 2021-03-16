//#region Custom configurations packages

const express = require('express')
const app = express()
const config = require('./config/index')
const cors = require('cors')
const moment = require('moment')
const morgan = require('morgan')
const bodyParser = require('body-parser')

//#endregion

//#region Definitions/Custom settings/Middle wares

//app.set('view engine', 'ejs')
app.use(morgan('dev'))
app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))

// Public path
app.use(express.static('public'))


app.use(cors);
app.use(function (req, res, next) {

  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')
  res.setHeader('Access-Control-Allow-Credentials', true)

  next();

});

// Error no unknown routes
app.use(function (req, res) {
  res.status(404).json({
    status: false,
    message: 'Endpoint not found. Contact the system administrator for more information;'
  })
});

// Custom error json
app.use(function (err, req, res, next) {
  let customError = require('./libs/customError')
  let error = customError(err, next)

  res.status(error.status).json({
    status: false,
    message: error.message,
    timestamp: moment().format('YYYY-MM-DD HH:MM:SS:00-03:00')
  })

});

//#endregion 

// Routes/endpoints (each version will be a new line)
require('./routes/v1')(app)

app.listen(config.api.port || 3000, function () {
  console.log('-------------------------------------------------------------------------------------------------')
  console.log(`API server started in port ${config.api.port || 3000} in ${Date()}`)
  console.log('-------------------------------------------------------------------------------------------------')
});

module.exports = app