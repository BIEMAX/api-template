/**
 * @swagger
 * /utilities/status:
 *   get:
 *     summary: "Check if the API is online"
 *     operationId: getApiStatus
 *     description: "Test dionei"
 *     deprecated: false
 *     tags:
 *      - Utilities
 *     responses:
 *       200:
 *         $ref: '#/components/responses/response200'
 *       400:
 *         $ref: '#/components/responses/response400'
 *       401:
 *         $ref: '#/components/responses/response401'
 *       403:
 *         $ref: '#/components/responses/response403'
 *       404:
 *         $ref: '#/components/responses/response404'
 */
'use strict'

const { waterfall } = require('../../../../libs/library')

module.exports = (req, res, next) => {
  waterfall(
    [
      // eslint-disable-next-line no-unused-vars
      (done) => {
        return res.status(200).json({
          status: true,
          message: 'API V1 is Online'
        })
      },
      (err) => {
        next(err)
      }
    ]
  )
}