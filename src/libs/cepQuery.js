/**
 * Lib to read HTML tags.
 */
const axios = require('axios')
/**
 * Lib that uses jQuery to read and extract html information.
 */
//const cheerio = require('cheerio')
const async = require('async')

/**
 * 
 * @param {*} cepToFind 
 * @returns 
 */
module.exports = (cep) => {
  return new Promise((resolve, reject) => {
    async.waterfall(
      [
        async (done) => {
          if (!cep) return new Error('CEP cannot be null')
          else if (cep.trim().length < 8) return new Error('CEP have to be only 8 numbers or 9 (with hyphen)')
          else {
            const url = 'https://www.google.com.br/maps/search/' + cep.replace(/-/g, ""); //Replace all ocurrences

            await axios(url)
              .then(async response => {
                const html = await response.data;
                const addressInfo = html.split('\"' + cep)[1].replace(',', '').split('",null')[0]

                if (addressInfo) {
                  let payLoad = {
                    status: true,
                    message: "Success to get the address",
                    data: {
                      cep: cep,
                      address: addressInfo.split('-')[0].trim(),
                      district: addressInfo.split('-')[1].split(',')[0].replace(/ /g, ''), //bairro
                      city: addressInfo.split('-')[1].split(',')[1].trim(),
                      state: addressInfo.split('-')[2].replace(/ /g, ''),
                    }
                  }
                  resolve(payLoad)
                }
              })
              .catch(err =>
                done(err)
              )
          }
        }
      ],
      (err) => {
        reject(err)
      }
    )
  })
}