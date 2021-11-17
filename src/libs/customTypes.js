/**
 * Enumerator with the  
 */
const EnumGenders = Object.freeze({
  Male: 'male',
  Female: 'female',
  Other: 'other',
})

/**
 * Enumerator with the days of the week
 */
const EnumDays = Object.freeze({
  'Sunday': 0 || 7,
  'Monday': 1,
  'Tuesday': 2,
  'Wednesday': 3,
  'Thursday': 4,
  'Friday': 5,
  'Saturday': 6,
})

/**
 * Aaaaa
 */
const EnumLogType = Object.freeze({
  /**
   * Just to known if a service it's working or it's on.
   */
  'Information': 0,
  /**
   * Notifiy if an automation it's on.
   */
  'Notification': 1,
  'Error': 2,
  'Success': 3
})

module.exports = { EnumDays, EnumLogType, EnumGenders }