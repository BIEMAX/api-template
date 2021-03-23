const config = require('../config/index')
const async = require('async')
const oracledb = require('oracledb')
oracledb.outFormat = oracledb.OBJECT

/**
 * Executed SQL command on Oracle databases
 * @param {*} sql String containing sql to execute
 * @param {*} params Array with parameters to use in query ([param1, param2, param3])
 * @param {*} autoCommit True to execute commit after insert, update, delete command.
 * @returns Object
 */
module.exports = (sql, params, autoCommit = false) => {
  return new Promise((resolve, reject) => {
    async.waterfall(
      [
        (done) => {
          if (config.database.type.toUpperCase().trim() != "ORACLE") {
            done(new Error('Oracle is not defined as default database to connection'))
          }
          else done(null)
        },
        (done) => {
          let connectionConfig = {
            user: config.database.user,
            password: config.database.password,
            connectString: config.database.connectionString
          }
          oracledb.getConnection(connectionConfig, done)
        },
        (conn, done) => {
          conn
            .execute(sql, params != undefined && params.length > 0 ? params : [], { autoCommit })
            .then((result) => {
              let payload = {
                status: true,
                message: `Sql executed with success. Rows affected: '${result.affectedRows}'`,
                data: {
                  rows: result.rows != undefined && result.rows.length > 0 ? result.rows : []
                }
              }
              if (conn) conn.close()
              resolve(payload)
            })
            .catch((err) => {
              done(err, conn)
            })
        }
      ],
      (err, conn) => {
        if (conn) conn.close()
        reject(err)
      }
    )
  })
}