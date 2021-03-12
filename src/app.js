const express = require('express')
const app = express()
const config = require('./config/index')

app.listen(config.api.port || 3000, function () {
    console.log('-------------------------------------------------------------------------------------------------')
    console.log(`API server started in port ${config.api.port || 3000} in ${Date()}`)
    console.log('-------------------------------------------------------------------------------------------------')
})