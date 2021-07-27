'use strict'

const axios = require('axios')
const request = require('request')

/**
 * @apiIgnore
 *
 * Consome endpoints REST
 *
 * @param {string} endPointUrl URL to execute a request.
 * @param {string} method  HTTP method (GET, POST, DELETE, PUT, OPTIONS)
 * @param {string} auth HTTP authentication (ApiKey, Bearer, something in header)
 * @param {string} header Headers to add in requisition
 * @param {string} data JSON data object
 * @param {int} timeout Milliseconds before timing out request (default is 10 milliseconds)
 * @param {object} oAuth AuthenticationScheme in the options corresponds to the logical name for a particular authentication scheme
 * @promise {response object}
 * @reject {error}
 * @fulfill {body,statusCode}
 * @returns {Promise{body,statusCode}}
 * 
 * @example oAuth {
 * const oauth = {
 *         consumer_key: `${config.consumerKey}`,
 *         consumer_secret: `${config.consumerSecret}`,
 *         token: `${config.token}`,
 *         token_secret: `${config.tokenSecret}`
 *       }
 * }
 *
 */
module.exports = (endPointUrl, method, auth, header, data, timeout = 10000, oAuth) => {
  return new Promise((resolve, reject) => {
    const headers = header || {}
    headers['Content-Type'] = 'application/json;charset=UTF-8'
    headers['Access-Control-Allow-Origin'] = '*'

    if (auth) {
      const json = data ? JSON.stringify(data) : null
      endPointUrl = encodeURI(endPointUrl)
      axios({
        method: method,
        url: endPointUrl,
        auth: auth,
        headers: headers,
        data: json,
        timeout: timeout,
      })
        .then((response) => {
          resolve(response)
        })
        .catch((err) => {
          if (err.response) {
            if (err.response.statusText != undefined && err.response.status != 429) {
              let msg = JSON.stringify(err.response.statusText) && JSON.stringify(err.response.data)

              reject(msg)
              //reject(err.response.statusText)
            } else if (err.response.status == 429) {
              reject('Excedeu o número de requisições.')
            } else {
              reject(err.response.data)
            }
          } else {
            reject(err)
          }
        })
    } else {
      request(
        {
          method: method,
          uri: endPointUrl,
          oauth: oAuth,
          headers: headers,
          body: data,
          json: true,
          maxContentLength: Infinity,
          maxBodyLength: Infinity
        },
        (err, response) => {
          if (err) {
            reject(err)
          } else {
            resolve(response)
          }
        },
      )
    }
  })
}