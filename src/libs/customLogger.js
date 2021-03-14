const config = require('../config/index')
// const { Genders, PersonSchema } = require('./customTypes')
const EnumDays = require('./customTypes')

module.exports = (exception, body, type) => {
  async.waterfall(
    [
      (done) => {
        if ('teste' === EnumDays.Monday) {

        }
      }
    ]
  )
}

// module.exports := enum CustomType {
//   /**
//    * 
//    */
//   LOG = 0,
//   /**
//    *
//    */
//   NOTIFICATION = 1,
//   /**
//    *
//    */
//   ERROR = 2,
//   /**
//    *
//    */
//   SUCCESS = 3
// }