'use strict'

const async = require('async')

module.exports = (req, res, next) => {
  async.waterfall(
    [
      (done) => {
        return res.status(200).json(
          {
            status: true,
            message: 'API Online'
          }
        )
      },
      (err) => {
        next(err)
      }
    ]
  )
}