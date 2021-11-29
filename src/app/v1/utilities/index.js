const express = require('express')
const router = express.Router()

module.exports = (app) => {
  router.get('/status', require('./services/state'))
  router.get('/postman/collection', function (req, res, next) { require('./services/postmanCollection')(req, res, next, app) })
  router.get('/postman/endpoints', function (req, res, next) { require('./services/postmanEndpoints')(req, res, next, app) })
  return router
}