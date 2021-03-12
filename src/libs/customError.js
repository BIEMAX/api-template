/**
 * @apiIgnore 
 * @param {*} err 
 */
module.exports = (err) => {
    let error = {}

    error.status = err.status ? err.status : 400
    // TODO: Implement i18n to support multiple languages.
    error.message = err.message ? err.message : 'Sorry, something was wrong'
}