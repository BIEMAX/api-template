//TODO: Study the link bellow to implement capitalization in object String
//https://metring.com.br/javascript-primeira-letra-maiuscula#:~:text=Alternativamente%20você%20pode%20fazer%20o,letra%20usando%20substr(1)%20.

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