/**
 * @swagger
 * /users/test:
 *   post:
 *     summary: "Test"
 *     operationId: postTest
 *     description: "API Example"
 *     deprecated: true
 *     tags:
 *      - Users
 *     security:
 *       - Bearer: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
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

const async = require('async')
const cartao = require('../../../v1/users/modules/cartao')

module.exports = (req, res, next) => {
  async.waterfall(
    [
      (done) => {
        cartao(req.body)
          .then((data) => {
            return res.status(200).json(data)
          })
          .catch((err) => {
            done(err)
          })
      },
    ],
    (err) => {
      next(err)
    },
  )
}