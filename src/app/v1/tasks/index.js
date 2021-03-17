const express = require('express')
const router = express.Router()

module.exports = () => {
  router.post('/new', require('./services/newTask'))
  router.post('/tasks', require('./services/tasks'))

  return router
}