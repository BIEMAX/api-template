'use strict'

const { translate } = require('./library')

const axios = require('axios')
const async = require('async')

/**
 * Module
 * @param {Strgin} zipCode ZIP Code to get address information
 * @returns {Object} Object with address
 * @example const cepQuery = require('./libs/cepQuery')('93125-430')
 */
module.exports = async zipCode => {
  return new Promise((resolve, reject) => {
    async.waterfall(
      [
        // eslint-disable-next-line no-unused-vars
        (done) => {
          if (!zipCode) return reject(translate('CEP cannot be null'))
          else if (zipCode.trim().length < 8) reject('CEP have to be only 8 numbers or 9 (with hyphen)')
          else {
            const url = 'https://www.google.com.br/maps/search/' + zipCode.replace(/-/g, '') //Replace all ocurrences

            reject('dionei teste de linha')

            axios(url)
              .then(async response => {
                // await new Promise(res => setTimeout(res, 5000))
                const html = response.data
                const addressInfo = html.split('"' + zipCode)[1].replace(',', '').split('",null')[0]

                if (addressInfo) {
                  let payload = {
                    status: true,
                    message: 'Success to get the address',
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
                reject(err)
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