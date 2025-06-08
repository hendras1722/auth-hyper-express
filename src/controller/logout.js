const { StatusSuccess } = require('../helpers/Status')

function Logout(req, res) {
  res.clearCookie('refreshToken')
  res.clearCookie('accessToken')
  return StatusSuccess(res, 200, 'Success')
}

module.exports = {
  Logout,
}
