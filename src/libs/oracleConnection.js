const { waterfall, config, translate } = require('./library')

const oracledb = require('oracledb')
oracledb.outFormat = oracledb.OBJECT

/**
 * Return an object that contains connection to database, that can be
 * re-used (you need to close the connection after operations).
 * @example 
 * //Below has an example how to use the object
 * conn
 * .execute('your sql', [param1: '', param2: 2], { autoCommit: true })
 * .then((result) => { })
 * .catch((err) => { })
 */
function conn () {
  if (config.database.type.toUpperCase().trim() != 'ORACLE') {
    throw new Error(translate('lib.conn.oracle'))
  }
  else {
    let connectionConfig = {
      user: config.database.user,
      password: config.database.password,
      connectString: config.database.connectionString
    }
    oracledb.getConnection(connectionConfig, (err, conn) => {
      if (err) throw new Error(err)
      else return conn
    })
  }
}

/**
 * Executed SQL command on Oracle databases and closes connection
 * after done.
 * @param {String} sql String containing sql to execute
 * @param {Object} params Array with parameters to use in query ([param1, param2, param3])
 * @param {Boolean} autoCommit True to execute commit after insert, update, delete command.
 * @returns Object with data
 */
function executeSql (sql, params, autoCommit = false) {
  return new Promise((resolve, reject) => {
    waterfall(
      [
        (done) => {
          if (config.database.type.toUpperCase().trim() != 'ORACLE') {
            done(new Error(translate('lib.conn.oracle')))
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
/**
 * Contains the following functions:
 * -conn
 * -executeSql
 */
module.exports = { conn, executeSql }