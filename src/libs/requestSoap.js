'use strict'

const { waterfall, translate } = require('./library')

const axios = require('axios')
const xmlToJson = require('xml2js').parseString
var stripPrefix = require('xml2js').processors.stripPrefix

/**
 * 
 * @param {String} endpointUrl 
 * @param {String} xml 
 * @param {Object} headers 
 * @param {*} timeout 
 * @returns 
 */
module.exports = (endpointUrl, xml, headers = {}, timeout = 10000) => {
  return new Promise((resolve, reject) => {
    waterfall(
      [
        (done) => {
          if (!headers) {
            let newHeaders = {
              'Content-Type': 'text/xml;charset=utf-8',
              'Accept-Encoding': 'gzip,deflate',
              'Content-Length': xml?.length || 0,
              Connection: 'Keep-Alive',
              SOAPAction: endpointUrl,
              'Access-Control-Allow-Origin': '*',
            }
            headers = newHeaders
            done(null)
          }
          else done(null)
        },
        (done) => {
          let options = {
            method: 'post',
            url: endpointUrl,
            headers: headers,
            data: xml,
            timeout: timeout,
            maxContentLength: 100000000,
            maxBodyLength: 1000000000
          }
          axios(options)
            .then((response) => {
              done(null, response)
            })
            .catch((err) => {
              done(err)
            })
        },
        (response, done) => {
          if (response.data != undefined) {
            //https://www.npmjs.com/package/xml2js for options
            xmlToJson(response.data, { tagNameProcessors: [stripPrefix], trim: true, explicitArray: false, normalizeTags: true }, (err, result) => {
              if (err) {
                reject(err)
              } else {
                resolve({
                  status: 'Success',
                  data: result
                })
              }
            })
          } else done(new Error(translate('lib.soap.empty')))
        }
      ],
      (err) => {
        reject(err)
      }
    )
  })
}