/**
 * @swagger
 * /utilities/postman/endpoints:
 *   get:
 *     summary: "Get a list of available endpoints and export to a collection for postman import"
 *     operationId: getEndpointsAvailable
 *     description: "Get a list of available endpoints and export to a collection in Postman template, reading
 *                  multiples versions of current API and multiple endpoints. For each tag in swagger, is created
 *                  a folder in postman collection."
 *     tags:
 *      - Utilities
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

const { waterfall } = require('../../../../libs/library')

module.exports = (req, res, next, app) => {
  waterfall(
    [
      () => {

        let arrayRoutes = []

        app._router.stack.map(r => {
          if (r.name == 'router') {
            let routePath = r.regexp.toString().replace('^', '').split('\\')
            if (routePath[2] != '/?(?=') {
              arrayRoutes.push({
                version: routePath[1],
                name: routePath[2],
                fullPath: `${routePath[1]}${routePath[2]}/`,
                subRoutes: []
              })

              if (r.handle.stack != undefined) {
                r.handle.stack.map(sr => {
                  if (sr.route != undefined && sr.route.path.toString().trim() != '') {

                    let method = ''
                    if (sr.route.methods.post) method = 'post'
                    else if (sr.route.methods.get) method = 'get'
                    else if (sr.route.methods.put) method = 'put'
                    else if (sr.route.methods.delete) method = 'delete'

                    arrayRoutes[arrayRoutes.length - 1].subRoutes.push({
                      fullPath: sr.route.path,
                      method: method,
                      parameters: sr.keys
                    })
                  }
                })
              }
            }
          }
        })
        return res.status(200).json(arrayRoutes)
      },
    ],
    (err) => {
      next(err)
    },
  )
}