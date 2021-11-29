/**
 * @swagger
 * /utilities/endpoints:
 *   get:
 *     summary: "Get a list of available endpoints and export to a collection for postman import"
 *     operationId: getEndpointsAvailable
 *     description: "Get a list of available endpoints and export to a collection in Postman template, reading
 *                  multiples versions of current API and multiple endpoints. For each tag in swagger, is created
 *                  a folder in postman collection."
 *     tags:
 *      - utilities
 *     responses:
 *       200:
 *         description: Success
 *       400:
 *         description: Parâmetros Inválidos
 *       401:
 *         description: Não Autorizado
 *       404:
 *         description: Não existe
 */

const { waterfall, config } = require('../../../../libs/library')

module.exports = (req, res, next, app) => {
  waterfall(
    [
      () => {
        let structure = {
          info: {
            _postman_id: 'b984c158-6188-48fe-9265-318b06fc3e46',
            name: 'Staging example',
            schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json'
          },
          item: []
        }
        /**
         * Contains the final array (with all endpoints separated in folders and subfolders)
         */
        let versions = []
        /**
         * API Url
         */
        let baseUrl = config.api.environment == 'development' ? 'https://your.stage.domain.com.br' : 'https://your.production.domain.com.br'

        app._router.stack.map(r => {
          if (r.name == 'router') { //Need to be a router/endpoints
            let routePath = r.regexp.toString().replace('^', '').split('\\')
            if (routePath[2] != '/?(?=') { //Need to be a valid route

              /**
               * Contains the current version of endpoint
               */
              let currentVersionOfApi = routePath[1].replace('/', '')

              //Array with versions of API
              if (versions.length == 0) versions.push({ name: currentVersionOfApi, item: [] }) //Start array
              else {
                if (versions.filter(v => v.name == currentVersionOfApi).length <= 0) { //Check if already added the version in array
                  versions.push({ name: currentVersionOfApi, item: [] }) //Added if not exists yet
                }
              }

              if (r.handle.stack != undefined) {
                r.handle.stack.map(sr => {
                  if (sr.route != undefined && sr.route.path.toString().trim() != '') {

                    /**
                     * Contains subfolder name (where will stay the endpoints)
                     */
                    let subFolderName = routePath[2].replace('/', '').toUpperCase()

                    //Get the endpoint method
                    let method = ''
                    if (sr.route.methods.post) method = 'post'
                    else if (sr.route.methods.get) method = 'get'
                    else if (sr.route.methods.put) method = 'put'
                    else if (sr.route.methods.delete) method = 'delete'

                    //Get paths as arguments
                    let paths = sr.route.path.split('/').map(i => i).filter(i => i != undefined && i != '')
                    paths.unshift(routePath[1].replace('/', '')) //Version of API

                    /**
                     * Contains the index of current version of the general array
                     */
                    let versionIndex = 0

                    //Check if subfolder exists
                    if (versions[versionIndex].item.length == 0) versions[versionIndex].item = [{ name: subFolderName, item: [] }]
                    else {
                      versionIndex = versions.map(v => v.name).indexOf(currentVersionOfApi)
                      if (versions[versionIndex].item.filter(v => v.name == subFolderName).length <= 0) { //Check if already added the subfolder in array
                        versions[versionIndex].item.push({ name: subFolderName, item: [] }) //Added if not exists yet

                        versionIndex = versions.map(v => v.name).indexOf(currentVersionOfApi) //Get new index after inserting
                      }
                    }

                    let subFolderIndex = versions[versionIndex].item.map(s => s.name).indexOf(subFolderName)

                    /**
                     * Contains the parameters from endpoint
                     */
                    let request = {
                      name: `${subFolderName} - ${method} - ${sr.route.path}`,
                      request: {
                        method: method.toUpperCase(),
                        header: [
                          {
                            key: 'Authorization',
                            value: '<API-KEY OR BEARER-KEY HERE>',
                            type: 'text'
                          }
                        ],
                        body: {},
                        url: {
                          raw: `${baseUrl}${routePath[1]}${routePath[2]}/`,
                          protocol: 'https',
                          host: [
                            config.api.environment == 'development' ? 'apihml' : 'api',
                            'domain',
                            'com',
                            'br'
                          ],
                          path: paths
                        }
                      },
                      response: []
                    }

                    if (versions[versionIndex].item[subFolderIndex].item.length == 0) versions[versionIndex].item[subFolderIndex].item = [request]
                    else versions[versionIndex].item[subFolderIndex].item.push(request)
                  }
                })
              }
            }
          }
        })
        structure.item = versions
        return res.status(200).json(structure)
      },
    ],
    (err) => {
      next(err)
    },
  )
}