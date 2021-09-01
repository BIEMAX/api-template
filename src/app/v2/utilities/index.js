const express = require('express')
const router = express.Router()

module.exports = () => {
  router.get('/status', require('./services/state'))
  return router
}