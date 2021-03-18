const asyncWaterfall = require('../../../../libs/waterfall')
const mysql = require('../../../../libs/mySqlConnection')

const sqlInsertNewTask = require('../queries/insertNewTask')

module.exports = (params) => {
  return new Promise((resolve, reject) => {
    asyncWaterfall(
      [
        (done) => {
          let bindVars = {
            //Title
            title: params.taskTitle != undefined && params.taskTitle != null ? new String(params.taskTitle).trim() : '',
            //Description
            description: params.taskDescription != undefined && params.taskDescription != null ? new String(params.taskDescription).trim() : '',
            //UserName
            userName: params.userName != undefined && params.userName != null ? new String(params.userName).trim() : '',
            //UserMail
            userEmail: params.userEmail != undefined && params.userEmail != null ? new String(params.userEmail).trim() : '',
          }
          mysql(sqlInsertNewTask, bindVars)
            .then((data) => {
              // let payload = {
              //   status: true,
              //   message: "Row inserted with success"
              // }
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