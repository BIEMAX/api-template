const mysql = require('mysql')
const config = require('../config')
const async = require('async')

/**
 * Executed SQL command on MySQL databases
 * @param {String} sql String containing sql to execute
 * @param {Object} params Array with parameters to use in query ([param1, param2, param3])
 * @returns Object
 */
module.exports = (sql, params) => {
  return new Promise((resolve, reject) => {
    async.waterfall(
      [
        (done) => {
          if (config.database.type.toUpperCase().trim() != "MYSQL") {
            done(new Error('MySQL is not defined as default database to connection'))
          }
          else done(null)
        },
        (done) => {
          var conn = mysql.createConnection({
            host: config.database.server,
            user: config.database.user,
            password: config.database.password,
            database: config.database.name
          })

          conn.connect(function (err) {
            if (err) done(err)
            else {
              done(null, conn)
            }
          });
        },
        (conn, done) => {
          //Definitions to run sql
          // let bindVars = {
          //   sql: sql,
          //   timeout: 40000, //40s
          //   values: params
          // }
          conn.query(sql, params, function (err, result) {
            if (err) done(err)
            else {
              conn.release()
              let payload = {
                status: true,
                message: `Sql executed with success. Rows affected: '${result.affectedRows}'`,
                data: {
                  rows: result
                }
              }
              resolve(payload)
            }
          })
        }
      ],
      (err) => {
        reject(err)
      }
    )
  })
}