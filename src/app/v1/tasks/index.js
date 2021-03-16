const express = require('express')
const router = express.Router()

module.exports = () => {
  router.post('/new', require('./services/newTask'))

  return router
}