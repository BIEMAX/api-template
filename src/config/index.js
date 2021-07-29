require('dotenv').config()

/**
 * Gerenal configurations/definitions for API.
 */
module.exports = {
  /**
   * Contains the database connection
   */
  database: {
    /**
     * Server name (default localhost)
     */
    server: process.env.SERVER || 'localhost',
    /**
     * Username of database
     */
    user: process.env.USER,
    /**
     * User password of database
     */
    password: process.env.PASSWORD,
    /**
     * Name of database
     */
    name: process.env.NAME,
    /**
     * Connection string (used in Oracle)
     */
    connectionString: process.env.CONNECTION_STRING,
    /**
     * Type of server (Can be SQL, MySQL, MongoDB, CosmosDB, Oracle)
     */
    type: process.env.TYPE || 'MYSQL',
  },
  /**
   * Contains some definitions about API.
   */
  api: {
    applicationName: process.env.APINAME || 'API Template',
    version: '1.0.0',
    port: process.env.PORT || '3001',
    environment: process.env.ENVIRONMENT || 'Development',
    /**
     * True to show swagger documentation on web.
     */
    showDocumentation: process.env.SHOW_DOCUMENTATION || false,
    language: process.env.LANGUAGE || 'en-US',
  },
  /**
   * Cotains some definitions about authentication in requests.
   */
  security: {
    /**
     * Secret key to decrypt authorization on https header.
     */
    secretKey: process.env.SECRETKEY || '',
    /**
     * If defined this variable as 'true', will not ask for API-KEY
     * or Bearer-Key on requests.
     */
    canAllowNonSecureRequests: process.env.ALLOW_NON_SECURITY_REQUESTS || false,
    /**
     * If defined this variable as 'true', will validate the API-KEY
     * in a database query (you need to specific the query).
     */
    shouldValidateApiKeyInDatabase: process.env.VALIDATE_APIKEY_IN_DATABASE || false,
    /**
     * Array of API KEY's (you can create a logic to authorized in database table
     * this keys).
     */
    apiKeys: [
      { customer: 'A', id: '0', key: 'YOUR_KEY_HERE', hasExpiration: false, dateExpiration: '2021-03-31', scopes: ['sales', 'users', 'tasks'] },
      { customer: 'B', id: '1', key: 'YOUR_KEY_HERE', hasExpiration: false, dateExpiration: '2021-03-31', scopes: ['sales', 'users', 'tasks'] }
    ]
  },
  /**
   * Application Performance Management
   */
  apm: {
    /**
     * NewRelic APM
     */
    newRelic: {
      showErrorOnTerminal: false,
      apiKey: '',

    }
  }
}