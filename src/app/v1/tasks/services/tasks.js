/**
 * @swagger
 * /tasks/tasks:
 *   post:
 *     summary: "Get list of all tasks"
 *     operationId: tasks
 *     description: "Get list of all tasks"
 *     deprecated: false
 *     tags:
 *      - Tasks
 *     security:
 *       - Apikey: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             require:
 *               -taskTitle
 *             properties:
 *               taskTitle:
 *                 type: string
 *                 description: "Title of the task to find"
 *                 example: "SQL"
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