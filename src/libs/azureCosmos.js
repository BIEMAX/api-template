const { waterfall, config, translate } = require('./library')

const CosmosClient = require('@azure/cosmos').CosmosClient
const client = new CosmosClient(config.azure.cosmos).client.database()
const database = client.database(config.azure.database)

/**
 * Insert a new register inside Azure CosmosDB
 * @param {String} container Container name
 * @param {Object} body Json object (body) with parameters to insert in database
 * @returns {Boolean} True if success, false otherwise
 */
module.exports.insert = (container, body) => {
  return new Promise((resolve, reject) => {
    waterfall(
      [
        async () => {
          try {
            let cosmosContainer = database.container(container)
            let saveAzure = await cosmosContainer.items.create(body)
            if (saveAzure.statusCode == '201') {
              resolve({
                status: true,
                message: translate('lib.azure.success'),
                cosmosData: {
                  cosmosId: saveAzure.item.id
                }
              })
            } else reject(translate('lib.azure.error'), saveAzure)
          } catch (err) {
            reject(err)
          }
        }
      ],
      (err) => { reject(err) }
    )
  })
}

/**
 * Query existing data inside Azure CosmosDB
 * @param {String} container Container name
 * @param {String} query Query to run (SELECT * FROM database as d WHERE d.column = 'value')
 * @return {Object} Data from CosmosDB as object
 */
module.exports.query = (container, query) => {
  return new Promise((resolve, reject) => {
    waterfall(
      [
        async () => {
          try {
            let cosmosContainer = database.container(container)
            let data = await cosmosContainer.items.query({ query: query }).fetchAll()
            resolve({
              status: true,
              message: translate('lib.azure.success'),
              cosmosData: data
            })
          } catch (err) {
            reject(err)
          }
        }
      ],
      (err) => { reject(err) }
    )
  })
}

/**
 * Update existing data in CosmosDB
 * @param {String} container Container name
 * @param {String} cosmosId CosmosDB unique id 
 * @param {String} primaryKey Primary key of container (defined during creation)
 * @param {Object} body Json object (body) with parameters to update
 * @returns {Boolean} True if success, false otherwise
 */
module.exports.update = (container, cosmosId, primaryKey, body) => {
  return new Promise((resolve, reject) => {
    waterfall(
      [
        async () => {
          try {
            let cosmosContainer = database.container(container)
            let data = await cosmosContainer.item(cosmosId, primaryKey).replace(body)
            resolve(data)
          } catch (err) {
            reject(err)
          }
        }
      ],
      (err) => { reject(err) }
    )
  })
}

/**
 * Método responsável por deletar registro do cosmos db.
 * @param {String} cosmosContainer Nome do container no cosmos db
 * @param {String} idCosmos Id do documento no CosmosDb
 * @param {String} nomeArquivo Nome do arquivo em hash MD5
 * @returns {Boolean} True em caso de êxito, exceção em caso de erro.
 */
module.exports.deleteCosmosdb = (cosmosContainer, idCosmos, nomeArquivo) => {
  return new Promise((resolve, reject) => {
    waterfall(
      [
        (done) => {
          done(null)
        },
        async (done) => {
          try {
            let container = database.container(cosmosContainer)
            let deleted = await container.item(idCosmos, nomeArquivo).delete()
            resolve(deleted)
          } catch (e) {
            done(e)
          }
        }
      ],
      (err) => {
        reject(err)
      }
    )
  })
}