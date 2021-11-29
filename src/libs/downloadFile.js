'use strict'

const { newRelic, waterfall, translate } = require('./library')

var https = require('https')
var fs = require('fs')

/**
 * Download file from URl to destiny
 * @param {String} url File URL 
 * @param {String} folder Destiny/folder to download the file (e.g.: C:\\temp\\teste.pdf) 
 * @returns {Object} Object with information if the download was done/finish
 */
function downloadFile (url, folder) {
  return new Promise((resolve, reject) => {
    waterfall(
      [
        (done) => {
          const request = https.get(url, response => {
            if (response.statusCode === 200) {
              const file = fs.createWriteStream(folder, { flags: 'wx' })
              file.on('finish', () => {
                resolve({
                  status: true,
                  message: translate('lib.download.success'),
                  data: []
                })
              })
              file.on('error', err => {
                file.close()
                if (err.code === 'EEXIST') done(new Error(translate('lib.download.file')))
                else fs.unlink(folder, () => done(err.message)) // Delete temp file
              })
              response.pipe(file)
            } else if (response.statusCode === 302 || response.statusCode === 301) {
              //Recursively follow redirects, only a 200 will resolve.
              downloadFile(response.headers.location, folder).then((data) => resolve(data))
            } else {
              fs.unlink(folder, () => { }) // Delete temp file
              done(new Error(`Server responded with ${response.statusCode}: ${response.statusMessage}`))
            }
          })

          request.on('error', err => {
            done(new Error(err.message))
          })
        }
      ],
      (err) => {
        newRelic(err, null, null, { url, destino: folder })
        reject(err)
      }
    )
  })
}

module.exports = { downloadFile }