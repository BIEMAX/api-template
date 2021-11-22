'use strict'

const { waterfall, translate } = require('./library')

const axios = require('axios')

/**
 * Module
 * @param {Strgin} zipCode ZIP Code to get address information
 * @returns {Object} Object with address
 * @example const cepQuery = require('./libs/cepQuery')('93125-430')
 */
module.exports = (zipCode) => {
  return new Promise((resolve, reject) => {
    waterfall(
      [
        (done) => {
          if (!zipCode) return reject(translate('lib.zip.empty'))
          else if (zipCode.trim().length < 8) reject(translate('lib.zip.size'))
          else {
            zipCode = !zipCode.includes('-') ? `${new String(zipCode).trim().substring(0, 5)}-${new String(zipCode).trim().substring(5, zipCode.length)}` : zipCode
            const url = 'https://www.google.com.br/maps/search/' + zipCode.replace(/-/g, '') //Replace all ocurrences
            axios(url)
              .then(async response => {
                // await new Promise(res => setTimeout(res, 5000))
                const html = response.data
                const addressInfo = html.split('"' + zipCode)[1].replace(',', '').split('",null')[0]

                if (addressInfo) {
                  let payload = {
                    status: true,
                    message: translate('lib.zip.success'),
                    data: {
                      cep: zipCode,
                      address: addressInfo.split('-')[0].trim(),
                      district: addressInfo.split('-')[1].split(',')[0].replace(/ /g, ''), //bairro
                      city: addressInfo.split('-')[1].split(',')[1].trim(),
                      state: addressInfo.split('-')[2].replace(/ /g, ''),
                    }
                  }
                  resolve(payload)
                }
                else {
                  resolve({
                    status: false,
                    mensage: '',
                    data: []
                  })
                }
              })
              .catch(err =>
                done(err)
              )
          }
        },
      ],
      (err) => {
        reject(err)
      }
    )
  })
}