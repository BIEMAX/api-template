'use strict'

/**
 * Validate if a phone number is valid and return without any special characters.
 * @param {String} ddd Area/Country code
 * @param {String} phone Phone number
 */
module.exports = (ddd, phone) => {
  let tempDdd = '', tempPhone = ''

  //Validade parameters type
  ddd = typeof ddd != 'string' ? '051' : ddd
  phone = typeof phone != 'string' ? (typeof phone == 'object' && new String(phone[0][0]).trim() != '' ? new String(phone[0][0]).trim() : '') : phone

  //Remove all non char characters
  phone = phone.trim().replace(/[^0-9]/g, '')
  ddd = ddd.trim().replace(/[^0-9]/g, '')

  //DDD need to be three chars
  ddd = ddd.length > 3 ? ddd.substring(0, 3) : ddd

  //Format area code (supports only '051' DDD)
  if (ddd == undefined || ddd == null || new String(ddd).trim() == '') tempDdd = '051'
  else if (ddd == '51') tempDdd = '051'
  else if (ddd == '051') tempDdd = ddd
  else if (ddd != '51' || ddd != '051') tempDdd = '051'

  //Remove DDD from phone number
  phone = phone.startsWith('051') ? phone.replace('051', '') : phone
  phone = phone.startsWith('51') ? phone.replace('51', '') : phone

  //Format phone number
  if (phone == undefined || phone == null || new String(phone).trim() == '') tempPhone = ''
  else if (phone.startsWith('3') && phone.length == 8) tempPhone = phone //Home phone
  else if ((phone.startsWith('8') || phone.startsWith('9')) && phone.length == 8) tempPhone = `9${phone}` //Se faltar o dígito 9, insere
  else tempPhone = phone //Telefone está correto após as validações e remoções de caracteres especiais

  //Só retorna o telefone formatado caso conter um telefone válido
  return tempPhone == '' && tempPhone.length < 11 ? '' : tempDdd + tempPhone
}