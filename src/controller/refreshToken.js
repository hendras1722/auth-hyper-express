const jwt = require('jsonwebtoken')
const { StatusError, StatusSuccess } = require('../helpers/Status')
const { generateAccessToken } = require('../helpers/jwt')

function RefreshToken(req, res) {
  const refreshToken = req.cookies?.['refreshToken']
  if (!refreshToken) {
    return StatusError(res, 401, 'Unauthorized')
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET_REFRESH)
    const accessToken = generateAccessToken({ user: decoded.user })

    res.header('Authorization', accessToken)
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      sameSite: 'strict',
    })

    return StatusSuccess(res, 200, 'Success', { accessToken })
  } catch (error) {
    console.log(error.response)
    if (error.errors) {
      const errors = error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }))
      return StatusError(res, 400, 'Invalid Refresh Token', errors)
    }
    StatusError(
      res,
      400,
      'Invalid Refresh Token',
      error.message ?? error.toString()
    )
  }
}

module.exports = {
  RefreshToken,
}
