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
     * Connection string (used in Oracle and MongoDb)
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
    environment: process.env?.ENVIRONMENT != undefined ? process.env.ENVIRONMENT.toLowerCase() : 'development',
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
  },
  /**
   * SendGrid - Email delivery service
   */
  sendgrid: {
    apiKey: '',
    apiUrl: 'https://api.sendgrid.com/v3/'
  },
  /**
   * Azure - Cloud Services
   */
  azure: {
    /**
     * Database name
     */
    database: '',
    cosmos: {
      /**
       *  The service endpoint to use to create the client.
       */
      endpoint: '',
      /** The account master or readonly key */
      key: '',
    }
  },
  google: {
    /**
     * Contains configuration to connect to firebase (that can be use for connect to realtime database, firestore
     * and other functionalities)
     */
    firebase: {
      development: {
        'type': 'service_account',
        'project_id': '<YOUR_PROJECT_ID>',
        'private_key_id': '<YOUR_PRIVATE_KEY>',
        'private_key': '<YOUR_CERTIFICATE>',
        'client_email': '<YOUR_CLIENT_MAIL>',
        'client_id': '<YOUR_CLIENT_ID>',
        'auth_uri': 'https://accounts.google.com/o/oauth2/auth',
        'token_uri': 'https://oauth2.googleapis.com/token',
        'auth_provider_x509_cert_url': 'https://www.googleapis.com/oauth2/v1/certs',
        'client_x509_cert_url': '<YOUR_FIREBASE_CLIENT_CERTIFICATE>'
      },
      stage: {
        'type': 'service_account',
        'project_id': '<YOUR_PROJECT_ID>',
        'private_key_id': '<YOUR_PRIVATE_KEY>',
        'private_key': '<YOUR_CERTIFICATE>',
        'client_email': '<YOUR_CLIENT_MAIL>',
        'client_id': '<YOUR_CLIENT_ID>',
        'auth_uri': 'https://accounts.google.com/o/oauth2/auth',
        'token_uri': 'https://oauth2.googleapis.com/token',
        'auth_provider_x509_cert_url': 'https://www.googleapis.com/oauth2/v1/certs',
        'client_x509_cert_url': '<YOUR_FIREBASE_CLIENT_CERTIFICATE>'
      },
      production: {
        'type': 'service_account',
        'project_id': '<YOUR_PROJECT_ID>',
        'private_key_id': '<YOUR_PRIVATE_KEY>',
        'private_key': '<YOUR_CERTIFICATE>',
        'client_email': '<YOUR_CLIENT_MAIL>',
        'client_id': '<YOUR_CLIENT_ID>',
        'auth_uri': 'https://accounts.google.com/o/oauth2/auth',
        'token_uri': 'https://oauth2.googleapis.com/token',
        'auth_provider_x509_cert_url': 'https://www.googleapis.com/oauth2/v1/certs',
        'client_x509_cert_url': '<YOUR_FIREBASE_CLIENT_CERTIFICATE>'
      }
    },
    realtimeDatabase: {
      url: {

      }
    }
  }
}