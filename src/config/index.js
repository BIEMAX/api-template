require('dotenv').config()

module.exports = {
  /**
   * Contains the database connection
   */
  database: {
    /**
     * Server name (default localhost)
     */
    server: process.env.SERVER || "localhost",
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
    type: process.env.TYPE || "MYSQL",
  },
  api: {
    applicationName: 'API Template',
    version: '1.0.0',
    port: process.env.PORT || '3001',
    environment: process.env.ENVIRONMENT || 'Development',
  }
}