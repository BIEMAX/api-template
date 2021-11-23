'use strict'

const { waterfall, translate } = require('./library')

module.exports = (param) => {
  return new Promise((resolve, reject) => {
    waterfall(
      [
        (done) => {
          if (param) done(null)
        },
        () => {
          resolve(true)
        }
      ],
      (err) => {
        reject(err)
      }
    )
  })
}