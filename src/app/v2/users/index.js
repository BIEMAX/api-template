const express = require('express')
const router = express.Router()

module.exports = () => {
  router.post('/test', require('./services/test'))

  return router
}