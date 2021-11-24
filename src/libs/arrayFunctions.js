'use strict'

/**
 * Module that group by an array by a property and return a new array
 * @param {Array} array Array of objects
 * @param {String} key Property name to group by
 * @returns
 */
function groupBy (array, key) {
  return array.reduce((acc, obj) => {
    const property = obj[key]
    acc[property] = acc[property] || []
    acc[property].push(obj)
    return acc
  })
}

/**
 * Module that filter data in an array
 * @param {Array} array Array of objects
 * @param {String} fieldName Property name to filter values
 * @param {String} value value to use to find the occurrences
 * @returns 
 */
function filterBy (array, fieldName, value) {
  return array.filter(p => new String(p[fieldName]).trim().toUpperCase() == new String(value).trim().toUpperCase())
}

/**
 * Module that order data inside array
 * @param {Array} array Array of objects
 * @param {String} fieldName Property name to order by
 * @returns Array ordered
 */
function orderBy (array, fieldName) {
  return array.sort((currentValue, nextValue) => (currentValue[fieldName] > nextValue[fieldName]) ? 1 : -1)
}

module.exports = { groupBy, filterBy, orderBy }