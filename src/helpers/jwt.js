const jwt = require('jsonwebtoken')

require('dotenv').config()
function generateAccessToken(username) {
  return jwt.sign(username, process.env.JWT_KEY, { expiresIn: '1800s' })
}

function generateRefreshToken(username) {
  return jwt.sign(username, process.env.JWT_SECRET_REFRESH, {
    expiresIn: '7d',
  })
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
}
