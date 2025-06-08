const jwt = require('jsonwebtoken')

require('dotenv').config()
function generateAccessToken(payload, expired) {
  return jwt.sign(payload, process.env.JWT_KEY, { expiresIn: expired ?? '1h' })
}

function generateRefreshToken(payload, expired) {
  return jwt.sign(payload, process.env.JWT_SECRET_REFRESH, {
    expiresIn: expired ?? '7d',
  })
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
}
