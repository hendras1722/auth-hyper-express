const jwt = require('jsonwebtoken')

require('dotenv').config()
function generateAccessToken(payload) {
  return jwt.sign(payload, process.env.JWT_KEY, { expiresIn: '1h' })
}

function generateRefreshToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET_REFRESH, {
    expiresIn: '7d',
  })
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
}
