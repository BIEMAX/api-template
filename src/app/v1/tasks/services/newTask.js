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
module.exports = (req, res, next) => {

}