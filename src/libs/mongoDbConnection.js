'use strict'

const { config, translate } = require('./library')

const MongoClient = require('mongodb').MongoClient
let client = null

/**
 * 
 * @returns 
 */
async function connect () {
  if (config.database.type.toUpperCase().trim() != 'MONGODB') {
    throw new Error(translate('lib.conn.mongo'))
  }
  else {
    if (!client) client = MongoClient(config.database.connectionString)

    await client.connect(config.database.name)
    return client.db()
  }
}

/**
 * 
 * @returns 
 */
async function disconnect () {
  if (!client) return true
  await client.close()
  client = null
  return true
}

module.exports = { connect, disconnect }