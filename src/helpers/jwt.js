const jwt = require('jsonwebtoken')

function generateAccessToken(username) {
  return jwt.sign(username, 'secret', { expiresIn: '1800s' })
}

function generateRefreshToken(username) {
  return jwt.sign(username, 'secret_refresh', {
    expiresIn: '7d',
  })
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
}
