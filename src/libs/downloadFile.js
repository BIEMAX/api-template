'use strict'

const { newRelic, waterfall } = require('./library')

var https = require('https')
var fs = require('fs')

/**
 * Download file from URl to destiny
 * @param {String} url File URL 
 * @param {String} destiny Destiny/folder to download the file (e.g.: C:\\temp\\teste.pdf) 
 * @returns {Object} Object with information if the download was done/finish
 */
function downloadFile (url, destiny) {
  return new Promise((resolve, reject) => {
    waterfall(
      [
        (done) => {
          const request = https.get(url, response => {
            if (response.statusCode === 200) {
              const file = fs.createWriteStream(destiny, { flags: 'wx' })
              file.on('finish', () => {
                resolve({
                  status: true,
                  message: 'Êxito ao finalizar download do arquivo',
                  data: []
                })
              })
              file.on('error', err => {
                file.close()
                if (err.code === 'EEXIST') done('File already exists')
                else fs.unlink(destiny, () => done(err.message)) // Delete temp file
              })
              response.pipe(file)
            } else if (response.statusCode === 302 || response.statusCode === 301) {
              //Recursively follow redirects, only a 200 will resolve.
              downloadFile(response.headers.location, destiny).then((data) => resolve(data))
            } else {
              fs.unlink(destiny, () => { }) // Delete temp file
              done(new Error(`Server responded with ${response.statusCode}: ${response.statusMessage}`))
            }
          })

          request.on('error', err => {
            done(err.message)
          })
        }
      ],
      (err) => {
        newRelic(err, null, null, { url, destino: destiny })
        reject(err)
      }
    )
  })
}

module.exports.downloadFile = downloadFile