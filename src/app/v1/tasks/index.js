const express = require('express')
const router = express.Router()
const { isAPIKeyAuthenticate } = require('../../../libs/authentication')

module.exports = () => {
  router.post('/new', isAPIKeyAuthenticate(''), require('./services/newTask'))
  router.post('/tasks', require('./services/tasks'))

  return router
}