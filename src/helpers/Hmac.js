const { createHmac } = require('crypto')
function hashingHmac(message) {
  const SECRET = 'msa123456789'
  const hmac = createHmac('sha256', SECRET)
  hmac.update(message)

  const hashedMessage = hmac.digest('base64')

  return hashedMessage
}

module.exports = hashingHmac
