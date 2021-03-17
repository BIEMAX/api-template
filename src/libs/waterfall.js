'use strict'

const { waterfall } = require('async')

/**
 * @apiIgnore 
 * Class that allow to run a series/array of functions 
 * (assyncronous or not) for invocation as the first argument, and a 
 * “complete” callback when the flow is finished as the second argument.
 * The array of functions are invoked in series.
 * @param {*} tasks Functions array to execute in series
 * @param {*} callback Callback when the flow is completed finished.
 */
module.exports = (tasks, callback) => {
  const tryTasks = tasks.map(
    task => {
      if (task.constructor.name == 'AsyncFunction') {
        return async (...params) => { return await task(...params) }
      }
      else {
        return (...params) => {
          try {
            task(...params)
          }
          catch (err) {
            params[params.length - 1](err)
          }
        }
      }
    })

  waterfall(tryTasks, callback)
}