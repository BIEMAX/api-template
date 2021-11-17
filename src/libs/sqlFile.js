const path = require('path')
const fs = require('fs')

/**
 * Returns a string with SQL Query in a file
 * @param {String} directory Directoty ('__dirname') to get the currenct directory path
 * @param {String} sqlFileName Sub directory ('../sql/mySqlFile') to read the file.
 * @returns String with SQL file content.
 */
module.exports = (directory, sqlFileName) => {
  return fs.readFileSync(path.join(directory, `${sqlFileName}.sql`)).toString()
}