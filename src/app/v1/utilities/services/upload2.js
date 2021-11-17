/**
 * @swagger
 * /utilities/upload2:
 *   post:
 *     summary: "Documents upload"
 *     operationId: postUploadTeste
 *     description: ""
 *     deprecated: false
 *     tags:
 *       - Utilities
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: upFile
 *         required: true
 *         description: "The file to upload"
 *         type: file
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