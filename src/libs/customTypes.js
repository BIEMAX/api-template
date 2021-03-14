// const mongoose = require('mongoose');

// const Genders = Object.freeze({
//   Male: 'male',
//   Female: 'female',
//   Other: 'other',
// });

// const PersonSchema = mongoose.Schema({
//   name: String,
//   gender: {
//     type: String,
//     enum: Object.values(Genders),
//   },
// });

// Object.assign(PersonSchema.statics, {
//   Genders,
// });

// module.exports = mongoose.model('person', PersonSchema);

/**
 * Enumerator with the days of the week
 */
const EnumDays = {
  /**
   * Property : value
   */
  "Monday": 1,
  "Tuesday": 2,
  "Wednesday": 3
}
Object.freeze(EnumDays)

/**
 * 
 */
const LogType = {
  /**
   * Just to known if a service it's working or it's on.
   */
  "Information": 0,
  /**
   * Notifiy if an automation it's on.
   */
  "Notification": 1,
  "Error": 2,
  "Success": 3
}

module.exports = EnumDays