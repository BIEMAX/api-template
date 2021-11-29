const express = require('express')
const router = express.Router()

module.exports = (app) => {
  router.get('/status', require('./services/state'))
  router.get('/endpoints', function (req, res, next) { require('./services/endpoints')(req, res, next, app) })
  return router
}