/**
 * Module that replace all occurrences on a string.
 * @param {String} originalString String with original text
 * @param {String} stringToFind String to find
 * @param {String} stringToReplace String to replace the occurrence
 * @returns 
 */
module.exports = (originalString, stringToFind, stringToReplace) => {
  if (originalString == undefined || originalString == null || new String(originalString).trim() == '') throw new Error('')
  else return originalString.split(stringToFind).join(stringToReplace)
}