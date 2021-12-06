'use strict'

const { config, waterfall } = require('../config/environment')
const os = require('os')

/**
 * Auxiliary documents for CachéDB and NodeJS
 * 
 * https://docs.intersystems.com/latest/csp/documatic/%25CSP.Documatic.cls?&LIBRARY=%25SYS&PRIVATE=1&CLASSNAME=%25SQL.StatementResult
 * 
 * https://docs.intersystems.com/latest/csp/docbook/DocBook.UI.Page.cls?KEY=BXJS
 */

// instantiate a Cache connector object in JavaScript
let irisModule = null
let cacheDb = null
let supportedNodeVersion = os.platform() == 'win32' ? 'v12.22.7' : 'v12.22.7' //(os.platform() == 'linux' ? 'v14.17.1' : 'v12.22.7')

if (process.version != supportedNodeVersion) throw new Error(`A versão do NodeJS precisa ser a '${supportedNodeVersion}' para conectar ao banco de dados CacheDB da InterSystems!`)
else {
  irisModule = require('iris')
  cacheDb = new irisModule.IRIS()
}

/**
 * Execute SQL query in database CachéDB from InterSystems.
 * @ob
 * @param {String} query String with query (Support SELECT, DELETE, UPDATE and INSERT)
 * @param {string} bindParameters Object with parameters
 * @example Example of bindParameters
 * {
 *  param1: 'value1',
 *  param2: 2,
 *  param3: 0.25
 * }
 * @returns 
 */
module.exports = (query, bindParameters = undefined) => {
  /**
   * Represents a row from CachéDB that have a property if still
   * have rows to read (in case of select query);
   */
  let row = { result: 1 }

  return new Promise((resolve, reject) => {
    waterfall(
      [
        (done) => {
          if (process.version != 'v12.22.7') done(new Error('A versão do NodeJS precisa ser a \'v12.22.7\' para conectar ao banco de dados CacheDB da InterSystems!'))
          else if (query == null || query == undefined || new String(query).trim() == '') done(new Error('O parâmetro \'query\' não pode ser vazio ou nulo'))
          else done(null)
        },
        (done) => {
          if (bindParameters != undefined && typeof bindParameters != 'object') done(new Error('O parâmetro \'bindParameters\' precisa ser do tipo \'object\''))
          else if (bindParameters != undefined && typeof bindParameters == 'object') {
            let queryTemp = query
            for (let p in bindParameters) {
              if (p != undefined) {
                if (queryTemp.includes(`:${p}`)) queryTemp = queryTemp.trim().split(`:${p}`).join(`'${bindParameters[p]}'`)
              }
            }
            query = queryTemp
            done(null)
          }
          else done(null)
        },
        (done) => {
          let result = cacheDb.open({ // Open the connection to the Caché database (adjust parameters for your Cache system)
            ip_address: config.matrix.ip,
            tcp_port: config.matrix.porta,
            username: config.matrix.usuario,
            password: config.matrix.senha,
            namespace: config.matrix.namespace
          })

          if (query.toUpperCase().startsWith('SELECT')) {
            /**
             * Contém um array com as colunas da query
             */
            let listSqlColumns = getSqlColums(query)

            if (result.ok == 0) done(new Error(result.ErrorMessage))
            else {
              result = cacheDb.invoke_classmethod({ class: '%SYSTEM.SQL', method: 'Execute', arguments: [query], max: 100 })
              var o = { oref: result.result }
              let dadosRetornar = []
              do {
                row = cacheDb.invoke_method(o, '%Next') //Lê linha a linha
                let linhaRetornar = {} //Contém um objeto que irá abrigar as propriedades (colunas e valores)

                if (row.result != 0) { //Condição para o primeiro loop
                  for (let x = 0;x < listSqlColumns.length;x++) {
                    var coluna = cacheDb.invoke_method(o, '%GetData', listSqlColumns[x].id + 1)
                    linhaRetornar[`${listSqlColumns[x].nome}`] = new String(coluna.result).replace('�', 'A')
                  }
                  dadosRetornar.push(linhaRetornar) //Adiciona a linha no array final
                }
                //TODO: Implement some else logic here
              }
              while (row.result != 0)
              done(null, dadosRetornar)
            }
          } else if (query.toUpperCase().startsWith('UPDATE') || query.toUpperCase().startsWith('INSERT') || query.toUpperCase().startsWith('DELETE')) {
            if (result.ok == 0) done(new Error(result.ErrorMessage))
            else {
              result = cacheDb.invoke_classmethod({ class: '%SYSTEM.SQL', method: 'Execute', arguments: [query] })
              // eslint-disable-next-line no-redeclare
              var o = { oref: result.result }

              row = cacheDb.get_property(o, '%ROWID') //Read each row
              if (row.value === '') { //Cannot execute the commands
                var message = cacheDb.get_property(o, '%Message')
                done(new Error(`Erro ao executar o comando '${query.split(' ')[0].trim()}': ${message.value}`))
              } else done(null, [{ mensagem: `Sucesso ao executar o comando '${query.split(' ')[0].trim()}'`, rowid: row.value }])
            }
          } else done(new Error('Não foi possível identificar a instrução SQL à ser executada no CachéDB'))
        },
        (dados) => {
          if (cacheDb) cacheDb.close()
          resolve({
            status: dados.length > 0,
            mensagem: dados.length > 0 ? 'Sucesso ao obter os dados' : 'Não foi possível localizar locais para atendimento com base na unidade informada',
            data: dados
          })
        }
      ],
      (err) => {
        if (cacheDb) cacheDb.close() // close the database connection
        reject(err)
      }
    )
  })
}

/**
 * Function that reads a SQL query and return the each column of SQL
 * @param {String} query SQL Query
 * @returns Array with columns
 */
function getSqlColums (query) {
  let columnsString = new String(query).trim().split('SELECT')[1].split('FROM')[0] //Get only parameters
  let columns = columnsString.split(',')
  let data = []

  for (let x = 0;x < columns.length;x++) {
    if (columns[x].replace(/\r\n/g, '').includes('"')) { //Columns with alias
      data.push({
        id: x,
        nome: columns[x].replace(/\r\n/g, '').trim().match(/"(\w+)"/)[1]
      })
    } else { //Columns without alias
      data.push({
        id: x,
        nome: columns[x].replace(/\r\n/g, '').trim()
      })
    }
  }
  return data
}