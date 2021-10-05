const { waterfall, config, translate } = require('../libs/library')

const CosmosClient = require('@azure/cosmos').CosmosClient
const client = new CosmosClient(config.azure.cosmos).client.database()
const database = client.database(config.azure.database)

/**
 * Insert a new register inside Azure CosmosDB
 * @param {String} container Container name
 * @param {Object} body Json object (body) with parameters to insert in database
 * @returns {Boolean} True if success, false otherwise
 */
module.exports.insertCosmosdb = (container, body) => {
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
                data: {
                  cosmosId: saveAzure.item.id
                }
              })
            } else reject(translate('lib.azure.error'), saveAzure)
          } catch (err) {
            reject(err)
          }
        }
      ],
      (err) => {
        reject(err)
      }
    )
  })
}