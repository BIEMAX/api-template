const config = require('../config')

/**
 * Method that define the application name for APM (Application Performance Monitoring)
 * according to the environment.
 */
module.exports = () => {
  return config.api.applicationName
}