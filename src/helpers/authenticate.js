const jwt = require('jsonwebtoken')

function auth(req, res, next) {
  try {
    const authHeader = req.headers['authorization']
    const refreshToken = req.cookies?.['refreshToken']
    const token = authHeader && authHeader.split(' ')[1]

    if (!token && !refreshToken) {
      throw new Error('Unauthorized')
    }

    if (token == null)
      return res.status(401).json({ code: 401, message: 'Unauthorized' })

    jwt.verify(token, 'secret', (err, user) => {
      console.log(err)

      if (err)
        return res.status(403).json({ code: 403, message: 'Unauthorized' })

      req.user = user

      next()
    })
  } catch (error) {
    console.log(error.message)

    if (error.errors) {
      const errors = error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }))
      return res.status(400).json({
        code: 400,
        message: error.message,
        errors,
      })
    }

    res.status(400).json({
      code: 400,
      message: error.message,
      error: error.message || error.toString(),
    })
  }
}

module.exports = auth
