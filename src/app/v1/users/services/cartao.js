/**
 * @swagger
 * /cadastro/cartao:
 *   post:
 *     summary: "Solicitação da segunda via do cartão do beneficiário"
 *     operationId: postSegundaVia
 *     description: "Solicita a segunda via do cartão do beneficiário através do aplicativo."
 *     deprecated: true
 *     tags:
 *      - Cadastro
 *     security:
 *       - Bearer: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CallBackSegundaViaCartao'
 *     responses:
 *       200:
 *         description: Cartao Solicitado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CallBackSegundaViaCartaoResultado'
 *       400:
 *         description: Parâmetros inválidos
 *       401:
 *         description: Não Autorizado
 *       404:
 *         description: Beneficiário não existe
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