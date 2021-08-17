'use strict'

const { waterfall, config, translate, moment } = require('./library')

const MongoClient = require('mongodb').MongoClient

/**
 * 
 * @param {String} collection Table/collection name
 * @param {Object} parameters 
 * @param {Date} initialDate 
 * @param {Date} endDate 
 * @returns 
 */
module.exports = (collection, parameters, initialDate = '', endDate = '') => {
  return new Promise((resolve, reject) => {
    waterfall(
      [
        (done) => {
          if (config.database.type.toUpperCase().trim() != 'MONGODB') {
            done(new Error(translate('lib.conn.mongo')), null)
          }
          else done(null)
        },
        (done) => {
          //https://docs.mongodb.com/manual/reference/connection-string
          //done(null, MongoClient(config.database.connectionString))
          // },
          // (conn, done) => {
          // const test = require('assert');
          // Connection url
          // const url = 'mongodb://localhost:27017'
          // Database Name
          // const dbName = 'test'
          // Connect using MongoClient
          //MongoClient.connect(config.database.connectionString, done)
          MongoClient.connect(config.database.connectionString, done)
        },
        (conn, done) => {
          //https://gist.github.com/jvadillo/3e856dd1abc4fd57cc76316c7dd0a16f
          conn
            .db(config.database.name)
            .collection(collection)
            .toArray((result) => {
              if (conn) conn.close()
              let payload = {
                status: true,
                message: '',
                data: result
              }
              resolve(payload)
            })
            .catch((err) => {
              done(err, conn)
            })
          // {
          //   const db = client.db(dbName);
          //   client.close();
          // });
        }
      ],
      (err, conn) => {
        if (conn) conn.close()
        reject(err)
      }
    )
  })
}