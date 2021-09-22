/**
 * @swagger
 * /utilities/upload:
 *   post:
 *     summary: "Documents upload"
 *     operationId: postUpload
 *     description: ""
 *     deprecated: false
 *     tags:
 *      - Utilities
 *     security:
 *       - Bearer: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             properties:
 *               orderId:
 *                 type: integer
 *               userId:
 *                 type: integer
 *               fileName:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: "Card requested"
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
          message: 'API V1 is Online'
        })
      },
      (err) => {
        next(err)
      }
    ]
  )
}