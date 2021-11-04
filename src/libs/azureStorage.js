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
 * Download a file from azure storage based on file name.
 * @param {String} nomeArquivo File name (identical on Azure Storage)
 * @param {String} extensaoArquivo File extension
 * @param {String} container Azure container
 * @returns {Object} 
 * {
 *   status: true in case of success, false instead.
 *   mensagem: "Message with success or error"
 *   data: Object
 * }
 */
module.exports.downloadFile = (nomeArquivo, extensaoArquivo = 'pdf', container = 'laudos', returnAsBase64 = true) => {
  return new Promise((resolve, reject) => {
    waterfall(
      [
        (done) => {
          done(null)
        },
        async (done) => {
          let containerClient = blobServiceClient.getContainerClient(container)
          let blobName = `${nomeArquivo}.${extensaoArquivo}`
          let blockBlobClient = containerClient.getBlockBlobClient(blobName) //Select blobb in storage
          let blobExist = await blockBlobClient.exists() //Check if blob exist

          if (blobExist) {
            let downloadBlockBlobResponse = await blockBlobClient.download(0) //Get blob information
            if (downloadBlockBlobResponse._response.status == 200) {
              let file = returnAsBase64 ?
                await streamToBuffer(downloadBlockBlobResponse.readableStreamBody) :
                await streamToString(downloadBlockBlobResponse.readableStreamBody) //Get base64 in string cryptographed
              resolve({
                status: true,
                message: '',
                data: Buffer.from(file).toString()
              })
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
                    blobContentType: arquivo.tipoArquivo ? getMimeType(arquivo.extensaoArquivo) : 'application/pdf'
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
function getMimeType (extension) {
  switch (new String(extension).trim().toLowerCase().replace('.', '')) {
    case 'aac': return 'audio/aac'
    case 'abw': return 'application/x-abiword'
    case 'arc': return 'application/octet-stream'
    case 'avi': return 'video/x-msvideo'
    case 'azw': return 'application/vndcase.amazoncase.ebook'
    case 'bin': return 'application/octet-stream'
    case 'bz': return 'application/x-bzip'
    case 'bz2': return 'application/x-bzip2'
    case 'csh': return 'application/x-csh'
    case 'css': return 'text/css'
    case 'csv': return 'text/csv'
    case 'doc': return 'application/msword'
    case 'docx': return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    case 'eot': return 'application/vndcase.ms-fontobject'
    case 'epub': return 'application/epub+zip'
    case 'gif': return 'image/gif'
    case 'htm': return 'text/html'
    case 'html': return 'text/html'
    case 'ico': return 'image/x-icon'
    case 'ics': return 'text/calendar'
    case 'jar': return 'application/java-archive'
    case 'jpeg': return 'image/jpeg'
    case 'jpg': return 'image/jpeg'
    case 'js': return 'application/javascript'
    case 'json': return 'application/json'
    case 'mid': return 'audio/midi'
    case 'midi': return 'audio/midi'
    case 'mpeg': return 'video/mpeg'
    case 'mpkg': return 'application/vndcase.applecase.installer+xml'
    case 'odp': return 'application/vndcase.oasiscase.opendocumentcase.presentation' //apache open libre office impress
    case 'ods': return 'application/vndcase.oasiscase.opendocumentcase.spreadsheet' //apache open libre office calc
    case 'odt': return 'application/vndcase.oasiscase.opendocumentcase.text' //apache open libre office writer
    case 'oga': return 'audio/ogg'
    case 'ogv': return 'video/ogg'
    case 'ogx': return 'application/ogg'
    case 'otf': return 'font/otf'
    case 'png': return 'image/png'
    case 'pdf': return 'application/pdf'
    case 'ppt': return 'application/vndcase.ms-powerpoint'
    case 'rar': return 'application/x-rar-compressed'
    case 'rtf': return 'application/rtf'
    case 'sh': return 'application/x-sh'
    case 'svg': return 'image/svg+xml'
    case 'swf': return 'application/x-shockwave-flash'
    case 'tar': return 'application/x-tar'
    case 'tif': return 'image/tiff'
    case 'tiff': return 'image/tiff'
    case 'ts': return 'application/typescript'
    case 'ttf': return 'font/ttf'
    case 'vsd': return 'application/vndcase.visio'
    case 'wav': return 'audio/x-wav'
    case 'weba': return 'audio/webm'
    case 'webm': return 'video/webm'
    case 'webp': return 'image/webp'
    case 'woff': return 'font/woff'
    case 'woff2': return 'font/woff2'
    case 'xhtml': return 'application/xhtml+xml'
    case 'xls': return 'application/vndcase.ms-excel'
    case 'xlsx': return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    case 'xml': return 'application/xml'
    case 'xul': return 'application/vndcase.mozillacase.xul+xml'
    case 'zip': return 'application/zip'
    case '3gp': return 'video/3gpp'
    case '3g2': return 'video/3gpp2'
    case '7z': return 'application/x-7z-compressed'
    default: return ''
  }
}