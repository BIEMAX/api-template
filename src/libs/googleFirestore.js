'use strict'

/**
 * For more information, use the following links:
 * 
 * First Steps:
 * https://firebase.google.com/docs/firestore/quickstart
 * 
 * Adding data:
 * https://firebase.google.com/docs/firestore/manage-data/add-data
 */

const { config } = require('../config/environment')

// eslint-disable-next-line no-unused-vars
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app')
// eslint-disable-next-line no-unused-vars
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore')

const serivceAccount = config.api.environment == 'development' ? require('../config/googleHml.json') : require('../config/googleHml.json')

/**
 * Initialize the connection with the server
 */
initializeApp({
  credential: cert(serivceAccount)
})

/**
 * Contains the Google Firestore Database Object
 */
let firestoreDatabase = getFirestore()

/**
 * Get a list of documents from FireStore
 * @param {String} collectionName Name of collection in Database
 * @returns {Object} Object with the data
 */
async function getDocuments (collectionName) {
  return firestoreDatabase.collection(collectionName).get()
}

/**
 * Add a new document in Google Firestore
 * @param {String} collectionName Name of collection in Database
 * @param {String} id Unique ID of the document
 * @param {Object} data Object with properties and values to save in database
 */
async function addDocument (collectionName, id, data) {
  let doc = await firestoreDatabase.collection(collectionName).doc(new String(id).trim()).set(data)
  return doc
}

/**
 * Update properties and values from existing document from Google Firestore
 * @param {String} collectionName Name of collection in Database
 * @param {String} id Unique ID of the document
 * @param {Object} data Object with properties and values to update in database
 * @returns 
 */
async function updateDocument (collectionName, id, data) {
  let doc = await firestoreDatabase.collection(collectionName).doc(new String(id).trim()).update(data)
  return doc
}

/**
 * Delete an existing document from Google Firestore
 * @param {String} collectionName Name of collection in Database
 * @param {String} id Unique ID of the document
 * @returns 
 */
async function deleteDocument (collectionName, id) {
  let doc = await firestoreDatabase.collection(collectionName).doc(new String(id).trim()).delete()
  return doc
}

module.exports = { getDocuments, addDocument, updateDocument, deleteDocument }