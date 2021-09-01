/**
 * @swagger
 * /tasks/todo:
 *   get:
 *     summary: "Get list of all tasks that need to be done"
 *     operationId: tasksTodo
 *     description: "Get list of all tasks that need to be done"
 *     deprecated: false
 *     tags:
 *      - Tasks
 *     security:
 *       - Apikey: []
 *     parameters:
 *       - in: query
 *         name: "userResponsible"
 *         required: true
 *         description: "user responsible to fuck you"
 *         collectionFormat: "multi"
 *         schema:
 *           type: array
 *           items: 
 *             type: string
 *             enum: ["anderson", "dionei", "eduardo", "emer", "gui", "igor", "jowkeen", "lucas", "thiago", "thieize", "renan"]
 *             default: "dionei"
 *       - in: path
 *         name: obs
 *         required: true
 *         description: "Observação do cancelamento"
 *         schema:
 *           type: string
 *           example: "Fulano de tal, desistiu de aderir ao plano"
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
const getAllTasks = require('../modules/tasks')

module.exports = (req, res, next) => {
  async.waterfall(
    [
      (done) => {
        getAllTasks(req.body)
          .then((data) => {
            return res.status(200).json(data)
          })
          .catch((err) => {
            done(err)
          })
      }
    ],
    (err) => {
      next(err)
    }
  )
}