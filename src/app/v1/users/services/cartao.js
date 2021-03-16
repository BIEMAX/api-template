/**
 * @swagger
 * /users/cartao:
 *   post:
 *     summary: "Solicitação da segunda via do cartão do beneficiário"
 *     operationId: postSegundaVia
 *     description: "Solicita a segunda via do cartão do beneficiário através do aplicativo."
 *     deprecated: true
 *     tags:
 *      - Users
 *     security:
 *       - Apikey: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             require:
 *               -cpf
 *               -userName
 *               -userId
 *             properties:
 *               cpf:
 *                 type: string
 *                 description: "CPF of user"
 *                 example: "12345678912"
 *               userName:
 *                 type: string
 *                 description: "User name"
 *                 example: "Dionei Beilke dos Santos"
 *               userId:
 *                 type: string
 *                 description: "User id"
 *                 example: "12"
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
const cartao = require('../modules/cartao')

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