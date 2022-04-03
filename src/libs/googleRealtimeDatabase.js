'use strict'

const { waterfall } = require('./library')
let googleAdmin = require('./googleAdmin')

if (googleAdmin.admin.app.length == 0) {
  googleAdmin.admin = require('./googleAdmin')()
}

/**
 * Promise that get data from realtime database table
 * @param {String} tableName Table name from Google Realtime Database
 */
function get (tableName) {
  return new Promise((resolve, reject) => {
    waterfall(
      [
        (done) => {
          var db = googleAdmin.admin.database()
          var ref = db.ref(tableName)
          ref.once('value', function (snapshot, err) {
            if (snapshot.val() == null) {
              //console.log('snapshot value: ', snapshot.val())
              //let d = 0
              resolve({
                status: true,
                message: '',
                data: snapshot.val()
              })
            } else done(err)
          })
        }
      ],
      (err) => {
        reject(err)
      }
    )
  })
}

/**
 * Promise that insert new data in realtime database
 * @param {String} tableName Table name from Google Realtime Database
 * @param {Object} data 
 * @example
 * let data = { //Example of data
 *   name: 'test',
 *   mail: 'test@mydomain.com',
 *   phone: '99999999999'
 * }
 * insert('users', data)
 *   .then((result) => { })
 *   .catch((err) => { })
 */
function insert (tableName, data) {
  return new Promise((resolve, reject) => {
    waterfall(
      [
        (done) => {
          var database = googleAdmin.admin.database()
          var reference = database.ref(tableName)
          reference.push(data, function (err) {
            if (err) done(err)
            else
              resolve({
                status: true,
                message: ''
              })
          })
        }
      ],
      (err) => {
        reject(err)
      }
    )
  })
}

//TODO: Conclude the implementation of the following action
// http://codesolution.co.in/category/posts/nodejs
// http://codesolution.co.in/detail/post/real-time-database-nodejs-and-firebase-restfull-api
// https://github.dev/Sudarshan101/nodefirebaseApi
function update (tableName, data) {
  return tableName + data
}

function remove (tableName, data) {
  return tableName + data
}

module.exports = { get, insert, update, remove }