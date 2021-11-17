const nr = require('newrelic')

const { config, moment, translate } = require('./library')

/**
 * @noticeerrororNewRelic
 *
 * Recebe informações sobre erroros/exceções/logs e envia para o NewRelic (cloud).
 * @param {Error} error Exception
 * @param {Object} customAttributes  Parameters (body, json, string, any information can be important for you log)
 * @param {string} extraInfo Parâmetro que contém o host/address/ip responsável pela chamada da API.
 * um terceiro, com todos os parâmetros utilizados dentro da API.
 */
module.exports = (error, customAttributes, extraInfo = '') => {

  //If parameter 'error' is undefined, generate a new error to get stack trace
  let newError = error || new Error('Error to get origin')
  let errorOrigin = ''

  //Lines with stack trace tracking
  let stackTrace = newError.stack.toString().trim().split('\n')

  //Get the last line of stack trace tracking
  errorOrigin = stackTrace[2].replace('at', '')

  if (config.apm.newRelic.showErrorOnTerminal == true) {
    console.log('Origin:\n')
    console.log(errorOrigin + ' | Horra do erro: ' + moment().format('DD-MM-YYYY hh:mm:ss'))
    console.log('\nOrigin ends here')
  }

  try {
    if (newError && errorOrigin) {
      nr.noticeError(error, {
        origin: errorOrigin,
        parameters: customAttributes == undefined ? translate('lib.newRelic.withoutInfo') : JSON.stringify(customAttributes),
        stackTrace: newError.stack == undefined ? translate('lib.newRelic.withoutInfo') : JSON.stringify(newError.stack),
        additionalInformation: JSON.stringify(extraInfo)
      })
    }
    else nr.noticeerroror(error, { caminhoFalha: null })
  }
  // eslint-disable-next-line no-empty
  catch (error) { }
}