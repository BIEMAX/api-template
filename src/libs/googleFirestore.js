'use strict'

/**
 * For more information, use the following links:
 * 
 * First Steps:
 * https://firebase.google.com/docs/firestore/quickstart
 * 
 * Adding data:
 * https://firebase.google.com/docs/firestore/manage-data/add-data
 * 
 * Possible types of values:
 * https://cloud.google.com/firestore/docs/reference/rest/v1/Value
 */

const async = require('async')
const { waterfall } = require('./library')

let googleAdmin = require('./googleAdmin')

if (googleAdmin.admin.app.length == 0) {
  googleAdmin.admin = require('./googleAdmin')()
}

/**
 * Contains the Google Firestore Database Object
 */
let firestoreDatabase = googleAdmin.getFirestore()

/**
 * Get a list of documents from FireStore
 * @param {String} collectionName Name of collection in Database
 * @returns {Object} Object with the data
 * @example
 * // Example of querying data
 * firebase.getDocuments('planos')
 *  .then((result) => {
 *    console.log('result: ', result)
 *
 *    if (result.docs != undefined && result.docs.length > 0) {
 *      console.log('nome: ', result.docs[0]._fieldsProto.nome.stringValue)
 *      console.log('registro: ', result.docs[0]._fieldsProto.registro.stringValue)
 *      console.log('status: ', result.docs[0]._fieldsProto.status.stringValue)
 *    }
 *  })
 *  .catch((err) => {
 *    console.log('error on firebase: ', err)
 *  })
 */
async function getDocuments (collectionName) {
  return firestoreDatabase.collection(collectionName).get()
}

/**
 * Read the properties dynamically from firestore documents and create a new array
 * with properties and values
 * @param {Array} array 
 * @example
 * // Example of creating a dynamic array
 * readDocumentsProperties(firestoreDocumentsArray.docs)
 *   .then((result) => {
 *     console.log('result: ', result)
 *   })
 *   .catch((err) => {
 *     done(err)
 *   })
 */
async function readDocumentsProperties (array) {
  return new Promise((resolve, reject) => {
    waterfall(
      [
        () => {
          let newArray = []
          async.forEachOf(array, (r, key) => {
            let properties = {}

            for (var p in r._fieldsProto) { //For each property, will check the values
              if (r._fieldsProto[p].valueType == 'arrayValue') {
                let arrayValues = r._fieldsProto[p].arrayValue.values //Contain an array os objects

                let subArray = [] //Contais array with all values/properties
                for (let x = 0;x < arrayValues.length;x++) {
                  let data = arrayValues[x].mapValue.fields //Get fields & values

                  let subProperties = {} //Will contain subproperties with respective values
                  for (var sp in data) {
                    subProperties[sp] = readField(data[sp])
                  }

                  subArray.push(subProperties)
                }
                properties[p] = subArray
              } else {
                properties[p] =
                  r._fieldsProto[p]?.nullValue || //Variáveis que podem conter valores
                  r._fieldsProto[p]?.booleanValue ||
                  r._fieldsProto[p]?.integerValue ||
                  r._fieldsProto[p]?.doubleValue ||
                  r._fieldsProto[p]?.timestampValue ||
                  r._fieldsProto[p]?.stringValue ||
                  r._fieldsProto[p]?.bytesValue ||
                  r._fieldsProto[p]?.referenceValue ||
                  r._fieldsProto[p]?.geoPointValue ||
                  r._fieldsProto[p]?.mapValue
              }
            }
            newArray.push(properties)
            if (key == array.length - 1)
              resolve(newArray)
          })
        }
      ],
      (err) => { reject(err) }
    )
  })
}

function readField (fieldObject) {
  return fieldObject?.nullValue || //Variables that can has a value
    fieldObject?.booleanValue ||
    fieldObject?.integerValue ||
    fieldObject?.doubleValue ||
    fieldObject?.timestampValue ||
    fieldObject?.stringValue ||
    fieldObject?.bytesValue ||
    fieldObject?.referenceValue ||
    fieldObject?.geoPointValue ||
    fieldObject?.mapValue
}

/**
 * Add a new document in Google Firestore
 * @param {String} collectionName Name of collection in Database
 * @param {String} id Unique ID of the document
 * @param {Object} data Object with properties and values to save in database
 * @example
 * // Example of adding new documents
 * planos()
 *   .then((result) => {
 *     if (result.status) {
 *       async.forEachOf(result.data, (r, key) => {
 *         firebase.addDocument('planos', r.id, r)
 *       })
 *     }
 *   })
 *   .catch((err) => {
 *     console.log('error on planos: ', err)
 *   })
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

/**
 * Delete a complete collection from Google Firestore
 * @param {String} collectionName Name of collection in Database
 * @returns Promise
 */
async function deleteCollection (collectionName) {
  const res = await firestoreDatabase.collection(collectionName)
    .get().then(querySnapshot => {
      querySnapshot.docs.forEach(d => { d.ref.delete() })
    })
  return res
}

module.exports = { getDocuments, addDocument, updateDocument, deleteDocument, readDocumentsProperties, deleteCollection }