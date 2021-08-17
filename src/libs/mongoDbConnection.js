'use strict'

const { waterfall, config, translate } = require('./library')

const MongoClient = require('mongodb').MongoClient

module.exports = () => {
  return new Promise((resolve, reject) => {
    waterfall(
      [
        (done) => {
          if (config.database.type.toUpperCase().trim() != 'MONGODB') {
            done(new Error(translate('lib.conn.mongo')))
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
          const url = 'mongodb://localhost:27017';
          // Database Name
          const dbName = 'test';
          // Connect using MongoClient
          //MongoClient.connect(config.database.connectionString, done)
          MongoClient.connect(config.database.connectionString, done)
        },
        (conn, done) => {
          conn.db(config.database.name)
          // {
          //   const db = client.db(dbName);
          //   client.close();
          // });
        }
      ],
      (err) => {
        reject(err)
      }
    )
  })
}