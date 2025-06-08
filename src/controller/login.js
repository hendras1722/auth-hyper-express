const { z } = require('zod')
const { validationZod } = require('../helpers/zod')
const { generateAccessToken, generateRefreshToken } = require('../helpers/jwt')
const { connectDB } = require('../configs/mongodb')

const schemaLogin = z
  .object({
    email: z.string().email(),
    password: z.string().min(6),
  })
  .strict()

async function Login(req, res) {
  try {
    const db = await connectDB()
    const { email, password } = req.body
    await validationZod(schemaLogin, { email, password })
    const result = await db.collection('users').findOne({ email })
    if (!result) {
      return res.status(404).json({
        code: 404,
        message: 'User not found',
      })
    }

    if (result.password !== password) {
      return res.status(401).json({
        code: 401,
        message: 'Invalid password',
      })
    }
    const token = generateAccessToken({ id: result.insertedId })
    const refreshToken = generateRefreshToken({ id: result.insertedId })
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
