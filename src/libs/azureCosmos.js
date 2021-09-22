const { waterfall, config, translate } = require('../libs/library')

const CosmosClient = require('@azure/cosmos').CosmosClient
const client = new CosmosClient(config.azure.cosmos)
const database = client.database(config.azure.database)

/**
 * Executa uma consulta para inserção de um novo registro no cosmos db
 * @param {String} container Nome do container no cosmos db
 * @param {Object} body Parâmetros que serão inseridos no cosmos db
 * @returns {Boolean} True em caso de êxito, reject em caso de erro.
 */
module.exports.insertCosmosdb = (container, body) => {
  return new Promise((resolve, reject) => {
    waterfall(
      [
        async () => {
          try {
            let container = database.container(container)
            let saveAzure = await container.items.create(body)
            if (saveAzure.statusCode == '201') {
              //TODO: Implement translation for messages.
              resolve({
                status: true,
                mensagem: 'Sucesso ao salvar no cosmos db',
                idCosmos: saveAzure.item.id
              })
            } else reject('Não foi possível inserir o registro no cosmosdb', saveAzure)
          } catch (e) {
            reject(e)
          }
        }
      ],
      (err) => {
        reject(err)
      }
    )
  })
}