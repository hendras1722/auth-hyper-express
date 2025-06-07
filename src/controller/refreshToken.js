const jwt = require('jsonwebtoken')

function RefreshToken(req, res) {
  const refreshToken = req.cookies?.['refreshToken']
  if (!refreshToken) {
    return res.status(401).send('Access Denied. No refresh token provided.')
  }

  try {
    const decoded = jwt.verify(refreshToken, 'secret_refresh')
    const accessToken = jwt.sign({ user: decoded.user }, 'secret', {
      expiresIn: '1h',
    })

    res.header('Authorization', accessToken)
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      sameSite: 'strict',
    })

    return res.status(200).json({
      code: 200,
      message: 'Success',
      data: { accessToken },
    })
  } catch (error) {
    console.log(error.response)
    if (error.errors) {
      const errors = error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }))
      return res.status(400).json({
        code: 400,
        message: 'Invalid Refresh Token',
        errors,
      })
    }
    res.status(400).json({
      code: 400,
      message: 'Invalid Refresh Token',
      error: error.message || error.toString(),
    })
  }
}

module.exports = {
  RefreshToken,
}
