'use strict'

/**
 * Module that group by an array by a property and return a new array
 * @param {Array} array Array of objects
 * @param {String} key Property name to group by
 * @returns 
 */
module.exports = (array, key) => {
  return array.reduce((acc, obj) => {
    const property = obj[key]
    acc[property] = acc[property] || []
    acc[property].push(obj)
    return acc
  })
}