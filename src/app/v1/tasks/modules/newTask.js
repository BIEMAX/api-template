const asyncWaterfall = require('../../../../libs/waterfall')
// const mysql = require('../../../../libs/mySqlConnection')

module.exports = (params) => {
  return new Promise((resolve, reject) => {
    asyncWaterfall(
      [
        (done) => {
          // mysql('select * from tasks', null)
          //   .then((data) => {
          //     resolve(data)
          //   })
          //   .catch((err) => {
          //     done(err)
          //   })
        }
      ],
      (err) => {
        reject(err)
      }
    )
  })
}