/**
 * 
 * @param {String} string String to capitalize (first word or every single word )
 * @param {Boolean} everySingleWord True if need to capitalize every single word in the string
 * @example 
 * const { capitalize } = require('./libs/stringFunctions')
 * console.log('Teste: ', capitalize('dioNei BeilKe DoS SaNtOs', true))
 * @returns 
 */
function capitalize (string, everySingleWord = false) {
  if (!everySingleWord) return string.trim().toLowerCase().replace(/^\w/, (c) => c.toUpperCase())
  else return string.trim().toLowerCase().replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())))
}

module.exports = { capitalize }