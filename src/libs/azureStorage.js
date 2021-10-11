/* eslint-disable indent */
const { waterfall, config } = require('./library')

/**
 * Object to access azure storare blob.
 */
const { BlobServiceClient } = require('@azure/storage-blob')
/**
 * Object containing the blob service client connection opened.
 */
const blobServiceClient = BlobServiceClient.fromConnectionString(config.azure.storage.connectionString)

/**
 * Método para baixar um documento da Azure Storage com base no nome do arquivo.
 * @param {String} nomeArquivo Nome do arquivo (precisa ser idêntico ao que já está na azure).
 * @param {String} extensaoArquivo Extensão do arquivo (padrão definido como 'pdf').
 * @param {String} container Container que será responsável por buscar o arquivo.
 * @returns {Object} 
 * {
 *   status: true or false,
 *   mensagem: "Mensagem com informações adicionais"
 *   data: Object
 * }
 */
module.exports.downloadFile = (nomeArquivo, extensaoArquivo = 'pdf', container = 'laudos') => {
  return new Promise((resolve, reject) => {
    waterfall(
      [
        (done) => {
          done(null)
        },
        async (done) => {
          let containerClient = blobServiceClient.getContainerClient(container)
          let blobName = `${nomeArquivo}.${extensaoArquivo}`

          //Seleciona o blob no storage
          let blockBlobClient = containerClient.getBlockBlobClient(blobName)
          //Verifica se o blob existe
          let blobExist = await blockBlobClient.exists()

          if (blobExist) {
            //Busca as informações do blob
            let downloadBlockBlobResponse = await blockBlobClient.download(0)
            if (downloadBlockBlobResponse._response.status == 200) {
              //Traz o base64 do blob
              //let resBase64 = await streamToString(downloadBlockBlobResponse.readableStreamBody)
              let resBase64 = await streamToBuffer(downloadBlockBlobResponse.readableStreamBody)
              let payload = {
                status: true,
                motivo_critica: '',
                data: Buffer.from(resBase64).toString()
              }
              resolve(payload)
            } else {
              done(new Error(`Resposta da azure não foi de sucesso: '${downloadBlockBlobResponse._response.status}'`))
            }
          } else {
            let payload = {
              status: false,
              motivo_critica: `${(__('app.cadastro.err.download'))} '${nomeArquivo}.${extensaoArquivo}'.`,
              data: null
            }
            resolve(payload)
          }
        }
      ],
      (err) => {
        reject(err)
      }
    )
  })
}
/**
 * Método responsável por fazer upload de N arquivos para azure.
 * @param {Object} arquivos Array contendo os documentos à serem enviados a azure.
 * @param {String} container Nome do container que irá receber os documentos da azure.
 * @param {Boolean} substituirArquivo True para substituir o arquivo no storage caso já exista.
 * @returns {Object}
 * {
 *   status: true or false,
 *   mensagem: "Mensagem com informações adicionais"
 *   data: Object
 * }
 * @example
 * [
 *   {
 *      nomeArquivo: '${infoBeneficiario.protocolo}-${infoBeneficiario.cpf}-${nomeDoc}',
 *      extensaoArquivo: 'pdf',
 *      tipoArquivo: 'application/pdf',
 *      base64: base64Stream,
 *   }
 * ]
 */
module.exports.uploadFiles = (arquivos, container = 'laudos', substituirArquivo = false) => {
  return new Promise((resolve, reject) => {
    waterfall(
      [
        (done) => {
          done(null)
        },
        async (done) => {
          if (!arquivos || arquivos.length == 0) done(new Error('Não foi identificado arquivos à serem feitos uploads'))
          else {
            try {
              let containerClient = blobServiceClient.getContainerClient(container)

              for (let x = 0;x < arquivos.length;x++) {
                let arquivo = arquivos[x]
                //Salva o arquivo no Storage
                let options = {
                  blobHTTPHeaders: {
                    blobContentType: arquivo.tipoArquivo ? tipoArquivo(arquivo.extensaoArquivo) : 'application/pdf'
                  }
                }
                let buffer = Buffer.from(arquivo.base64, 'base64')
                let blobName = `${arquivo.nomeArquivo}.${!arquivo.extensaoArquivo ? '.pdf' : arquivo.extensaoArquivo}`
                let blockBlobClient = containerClient.getBlockBlobClient(blobName)
                let blobExist = await blockBlobClient.exists()
                //Faz o upload caso seja uma atualização de documento ou caso não exista ainda no storage.
                if (substituirArquivo || !blobExist) {
                  // console.log('fiz o upload')
                  // console.log('substituirArquivo: ', substituirArquivo)
                  // console.log('blobExist: ', blobExist)
                  await blockBlobClient.upload(buffer, buffer.length, options)
                }
                if (x == arquivos.length - 1) {
                  let payload = {
                    status: true,
                    mensagem: 'Arquivos gravados com sucesso.',
                  }
                  resolve(payload)
                }
              }
            }
            catch (err) {
              done(err)
            }
          }
        }
      ],
      (err) => {
        if (err) reject(err)
      }
    )
  })
}

/**
 * Método responsável por fazer o remoção de N arquivos na azure.
 * @param {Object} arquivos Array contendo os documentos à serem deletados da azure.
 * @param {String} container Nome do container que irá receber os documentos da azure.
 * @returns {Object}
 * {
 *   status: true or false,
 *   mensagem: "Mensagem com informações adicionais"
 *   data: Object
 * }
 * @example
 * [
 *   {
 *      nomeArquivo: '${infoBeneficiario.protocolo}-${infoBeneficiario.cpf}-${nomeDoc}',
 *      extensaoArquivo: 'pdf',
 *      tipoArquivo: 'application/pdf'
 *   }
 * ]
 */
module.exports.deleteFiles = (arquivo, container = 'rascunho') => {
  return new Promise((resolve, reject) => {
    waterfall(
      [
        (done) => {
          done(null)
        },
        async (done) => {
          if (!arquivo || arquivo.length == 0) done(new Error('Não foi identificado arquivos à serem deletados'))
          else {
            try {
              let containerClient = blobServiceClient.getContainerClient(container)

              //let base64 = arquivo.base64
              let blobName = `${arquivo.nomeArquivo}.${arquivo.extensaoArquivo}`
              let blockBlobClient = containerClient.getBlockBlobClient(blobName)
              let blobExist = await blockBlobClient.exists()

              let payload = {
                status: true,
                mensagem: '',
              }

              if (blobExist) {
                await blockBlobClient.delete()
                payload.mensagem = 'Arquivo deletado com êxito'
              }
              else {
                payload.status = false
                payload.mensagem = `Não foi localizado arquivo '${blobName}' para exclusão`
              }

              resolve(payload)

            }
            catch (err) {
              done(err)
            }
          }
        }
      ],
      (err) => {
        reject(err)
      }
    )
  })
}

/**
 * Convert uma stream blob (formato da azure storage) para o formato base64
 * @param {Blob} blobStream Stream contendo o blob do arquivo
 * @returns Base64
 */
module.exports.convertBlobToBase64 = (blobStream) => {
  return new Promise((resolve, reject) => {
    const chunks = []
    blobStream.on('data', (data) => {
      chunks.push(data.toString())
    })
    blobStream.on('end', () => {
      resolve(chunks.join(''))
    })
    blobStream.on('error', reject)
  })
}

/**
 * Método responsável por converter uma stream em string.
 * @param {Object} readableStream
 * @returns {String} String contendo o conteúdo do stream.
 */
// eslint-disable-next-line no-unused-vars
async function streamToString (readableStream) {
  return new Promise((resolve, reject) => {
    const chunks = []
    readableStream.on('data', (data) => {
      chunks.push(data.toString())
    })
    readableStream.on('end', () => {
      resolve(chunks.join(''))
    })
    readableStream.on('error', reject)
  })
}

/**
 * Método responsável por converter uma stream em string buffer.
 * @param {Object} readableStream 
 * @returns {String} String contendo o buffer do arquivo
 */
async function streamToBuffer (readableStream) {
  return new Promise((resolve, reject) => {
    const chunks = []
    readableStream.on('data', (data) => {
      chunks.push(data instanceof Buffer ? data : Buffer.from(data))
    })
    readableStream.on('end', () => {
      resolve(Buffer.concat(chunks))
    })
    readableStream.on('error', reject)
  })
}

/**
 * Retorna o HTTP Mime Type de um arquivo para fins de download e upload.
 * Para mais informações, consulte o endereço: https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Basics_of_HTTP/MIME_types
 * @param {String} extension String contendo apenas a extensão (sem ponto)
 * @returns {String} String contendo o Mime Type do arquivo
 * @example 'application/pdf'
 */
function tipoArquivo (extension) {
  switch (new String(extension).trim().toUpperCase()) {
    case 'JPG': return 'image/jpg'
    case 'PNG': return 'image/png'
    case 'DOC': return 'application/msword'
    case 'DOCX': return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    case 'PDF': return 'application/pdf'
    case 'ODT': return 'application/vnd.oasis.opendocument.text' //apache open libre office writer
    case 'ODS': return 'application/vnd.oasis.opendocument.spreadsheet' //apache open libre office calc
    case 'ODP': return 'application/vnd.oasis.opendocument.presentation' //apache open libre office impress
    case 'JPEG': return 'image/jpeg'
    default: return ''
  }
}