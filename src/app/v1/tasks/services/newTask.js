/**
 * @swagger
 * /tasks/new:
 *   post:
 *     summary: "Create new task"
 *     operationId: newTask
 *     description: "Create new task"
 *     deprecated: false
 *     tags:
 *      - Tasks
 *     security:
 *       - Bearer: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             require:
 *               -taskTitle
 *               -taskDescription
 *               -userName
 *               -userEmail
 *             properties:
 *               taskTitle:
 *                 type: string
 *                 description: "Title of the task to create"
 *                 example: "Implement sql injection"
 *               taskDescription:
 *                 type: string
 *                 description: "Tasks description"
 *                 example: "Need to do 5 steps before start this task"
 *               userName:
 *                 type: string
 *                 description: "User name"
 *                 example: "Dionei Beilke Dos Santos"
 *               userEmail:
 *                 type: string
 *                 description: "User mail"
 *                 example: "contact@me.com.br"
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
const newTask = require('../modules/newTask')

module.exports = (req, res, next) => {
  async.waterfall(
    [
      (done) => {
        newTask(req.body)
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