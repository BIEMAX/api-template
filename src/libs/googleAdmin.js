'use strict'

const { config } = require('./library')

/**
 * Contains Google Firebase Administrator object
 */
const admin = require('firebase-admin')

/**
 * Contains Google Firestore object
 */
const { getFirestore } = require('firebase-admin/firestore')

/**
 * Initialize the connection with the server
 */
admin.initializeApp({
  credential: admin.credential.cert(config.google.firebase[config.api.environment]),
  databaseURL: config.google.realtimeDatabase.url
})

/**
 * Contains google firebase objects to use
 */
module.exports = { admin, getFirestore }