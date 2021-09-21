const { waterfall, config } = require('./library')
const hasValue = require('./hasValue')
const request = require('request')

/**
 * 
 * @param {String} email 
 * @param {Object} emailsCc 
 * @param {String} fromEmail 
 * @param {String} fromName 
 * @param {String} subject Mail subject/title
 * @param {Object} dynamicObject 
 * @example
 * {
 *    "email": "test@mail_test.com",
 *    "eMailDestinoCopia": "inovacao@doctorclin.com.br",
 *    "nomeRemetente": "API",
 *    "titulo": "Orientações de Exame",
 *    "textoDinamico": {
 *        "nome": "API",
 *        "data": "11/11/2019",
 *        "hora": "11:15",
 *        "unidadeAtendimento": "IAS-NH",
 *        "endereco": "Rua General Osorio,938 Hamburgo Velho",
 *        "preparo": "Levar exames, tomar banho"
 *    },
 *    "idTemplate": "d-86aeea26825a405aa432ca5ca450266d",
 *    "anexos": [
 *       {
 *          "content": 'Base64 do arquivo aqui'
 *          "filename": 'Nome do arquivo.extensaoArquivo'
 *          "type": 'application/pdf',
 *          "disposition": 'attachment'
 *       },
 *       {
 *          "content": 'Base64 do arquivo aqui'
 *          "filename": 'Nome do arquivo 2.extensaoArquivo'
 *          "type": 'application/p7s',
 *          "disposition": 'attachment'
 *       },
 *    ]
 * }
 * @returns 
 */
function sendEmail (email, emailsCc, fromEmail, fromName, subject, templateId, dynamicObject = {}) {
  return new Promise((resolve, reject) => {
    waterfall(
      [
        (done) => {
          //TODO: Finish the error messages implementation
          if (!hasValue(email, null)) done(new Error('E-mail cannot be null or undefined'))
          if (!hasValue(subject, null)) done(new Error('Subject cannot be null or undefined'))
          else if (!hasValue(templateId, null)) done(new Error('Template ID cannot be null or undefined'))
          else done(null)
        },
        (done) => {
          let body = {
            method: 'POST',
            url: `${config.sendgrid.apiUrl}mail/send`,
            headers: { 'content-type': 'application/json', authorization: 'Bearer ' + config.sendgrid.apiKey },
            body: {
              from: {
                email: fromEmail,
                name: fromName
              },
              subject: subject,
              personalizations: [
                {
                  to: [{ email: email }],
                  dynamic_template_data: hasValue(dynamicObject, null),
                },
              ],
              template_id: templateId,
            },
            attachments: null,
            json: true,
          }

          // eslint-disable-next-line no-unused-vars
          request(body, function (error, response, body) {
            if (error) done(error)
            else if (response.statusCode == 400) {
              let mensagemErro = `Error on '${response.body.errors[0].message}' in field '${response.body.errors[0]?.field}'. Please, check the help on '${response.body.errors[0]?.help}'`
              done(new Error(mensagemErro))
            }
            else {
              let payload = {
                status: true,
                message: 'E-mail enviado com exito',
                data: {
                  messageId: response.headers['x-message-id']
                }
              }
              resolve(payload)
            }
          })
        }
      ],
      (err) => {
        reject(err)
      }
    )
  })
}

module.exports = { sendEmail }