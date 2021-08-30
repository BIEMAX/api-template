const express = require('express')
const router = express.Router()

module.exports = () => {
  router.post('/state', require('./services/state'))
  return router
}