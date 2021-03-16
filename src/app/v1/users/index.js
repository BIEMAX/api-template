const express = require('express')
const router = express.Router()

module.exports = () => {
  router.post('/cartao', require('./services/cartao'))

  return router
}