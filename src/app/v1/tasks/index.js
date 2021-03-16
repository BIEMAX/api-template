const express = require('express')
const router = express.Router()

module.exports = () => {
  router.post('/new', require('./services/newTask'))
  router.get('/tasks', require('./services/tasks'))

  return router
}