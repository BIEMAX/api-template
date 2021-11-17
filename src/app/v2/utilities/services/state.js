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
 *         description: "Card requested"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   description: "teste"
 *                   type: boolean
 *                 message:
 *                   description: "teste 2"
 *                   type: string
 *       400:
 *         description: "Invalid parameters"
 *       401:
 *         description: "Not authorized"
 *       404:
 *         description: "Register doesn't exist"
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
          message: 'API V2 is Online'
        })
      },
      (err) => {
        next(err)
      }
    ]
  )
}