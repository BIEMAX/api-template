'use strict'

const { waterfall, translante } = require('./library')

module.exports = () => {
  return new Promise((resolve, reject) => {
    waterfall(
      [
        (done) => {
          resolve(true)
        }
      ],
      (err) => {
        reject(err)
      }
    )
  })
}