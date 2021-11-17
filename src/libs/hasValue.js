/**
 * Module that validate if 'parameter' has a value, if doesn't, return the default
 * value defined.
 * @param {*} parameter Property/variable to check the value
 * @param {*} defaultValue Default value if the property/variable it's undefined/null
 * @returns The 'parameter' value in case of not null/undefined or default value.
 */
module.exports = (parameter, defaultValue = '') => {
  if (parameter == undefined) return defaultValue
  else if (parameter == null) return defaultValue
  else if (typeof parameter == 'string') {
    if (new String(parameter).trim() == '') return defaultValue
    else return parameter
  }
  else return parameter
}