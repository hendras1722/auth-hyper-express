const { z } = require('zod')
const { validationZod } = require('../helpers/zod')
const { generateAccessToken, generateRefreshToken } = require('../helpers/jwt')

const schemaLogin = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

async function Login(req, res) {
  try {
    const { email, password } = req.body
    await validationZod(schemaLogin, { email, password })
    const token = generateAccessToken({ username: email })
    const refreshToken = generateRefreshToken({ username: email })
    res
      .cookie('refreshToken', refreshToken, {
        httpOnly: true,
        sameSite: 'strict',
      })
      .header('Authorization', token)

    return res.status(200).json({
      code: 200,
      message: 'Success',
      data: { token, refreshToken },
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
        message: 'Bad Request',
        errors,
      })
    }

    res.status(400).json({
      code: 400,
      message: 'Bad Request',
      error: error.message || error.toString(),
    })
  }
}

module.exports = {
  Login,
}
