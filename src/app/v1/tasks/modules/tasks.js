const asyncWaterfall = require('../../../../libs/waterfall')
const mysql = require('../../../../libs/mySqlConnection')

const sqlQueryAllTasks = require('../queries/queryTasks')

module.exports = (params) => {
  return new Promise((resolve, reject) => {
    asyncWaterfall(
      [
        (done) => {
          let bindVars = [
            //title
            params.taskTitle != undefined && params.taskTitle != null ? new String(params.taskTitle).trim() : ''
          ]
          mysql(sqlQueryAllTasks, bindVars)
            .then((data) => {
              resolve(data)
            })
            .catch((err) => {
              done(err)
            })
        }
      ],
      (err) => {
        reject(err)
      }
    )
  })
}