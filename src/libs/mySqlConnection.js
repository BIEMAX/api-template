const { waterfall, config, translate } = require('./library')

const mysql = require('mysql')

/**
 * Executed SQL command on MySQL databases
 * @param {String} sql String containing sql to execute
 * @param {Object} params Array with parameters to use in query ([param1, param2, param3])
 * @returns Object
 */
module.exports = (sql, params) => {
  return new Promise((resolve, reject) => {
    waterfall(
      [
        (done) => {
          if (config.database.type.toUpperCase().trim() != 'MYSQL') {
            done(new Error(translate('lib.conn.mysql')), null)
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

          conn.connect(done)
        },
        (conn, done) => {
          //Definitions to run sql
          // let bindVars = {
          //   sql: sql,
          //   timeout: 40000, //40s
          //   values: params
          // }
          conn
            .query(sql, params)
            .then((result) => {
              conn.release()
              let payload = {
                status: true,
                message: `Sql executed with success. Rows affected: '${result.affectedRows}'`,
                data: {
                  rows: result
                }
              }
              resolve(payload)
            })
            .catch((err) => {
              done(err, conn)
            })
        }
      ],
      (err, conn) => {
        if (conn) conn.release()
        reject(err)
      }
    )
  })
}