/**
 * @swagger
 * /utilities/status/api:
 *   get:
 *     summary: Check if the API is online
 *     operationId: getApiStatus
 *     tags:
 *      - Utilities
 *     responses:
 *       200:
 *         description: Retorno ok
 *       400:
 *         description: Parâmentros Inválidos
 *       401:
 *         description: Não Autorizado
 *       404:
 *         description: Dados não existem
 */
'use strict'

const async = require('async')

module.exports = (req, res, next) => {
  async.waterfall(
    [
      // eslint-disable-next-line no-unused-vars
      (done) => {
        return res.status(200).json(
          {
            status: true,
            message: 'API Online'
          }
        )
      },
      (err) => {
        next(err)
      }
    ]
  )
}