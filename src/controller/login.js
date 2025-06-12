const { z } = require('zod')
const { validationZod } = require('../helpers/zod')
const { generateAccessToken, generateRefreshToken } = require('../helpers/jwt')
const { connectDB } = require('../configs/mongodb')
const { StatusError, StatusSuccess } = require('../helpers/Status')
const hashingHmac = require('../helpers/Hmac')

const schemaLogin = z
  .object({
    email: z.string().email(),
    password: z.string().min(6),
  })
  .strict()

const Email = z.string().email()

async function Login(req, res) {
  try {
    const db = await connectDB()
    const { email, password } = req.body
    await validationZod(schemaLogin, { email, password })
    const HashPassword = await hashingHmac(password)
    const result = await db.collection('users').findOne({ email })
    if (!result) {
      return StatusError(res, 404, 'User not found')
    }

    if (result.password !== HashPassword) {
      return StatusError(res, 401, 'Invalid password')
    }
    const token = generateAccessToken({ id: result._id })
    const refreshToken = generateRefreshToken({ id: result._id })
    res
      .cookie('refreshToken', refreshToken, {
        httpOnly: true,
        sameSite: 'strict',
      })
      .header('Authorization', token)

    return StatusSuccess(res, 200, 'Success', { token, refreshToken })
  } catch (error) {
    console.log(error.message)

    if (error.errors) {
      const errors = error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }))
      return StatusError(res, 400, 'Bad Request', errors)
    }
    StatusError(res, 400, 'Bad Request', error.message || error.toString())
  }
}

async function CheckEmail(req, res) {
  try {
    const db = await connectDB()
    const { email } = req.body
    validationZod(Email, email)
    const result = await db.collection('users').findOne({ email })
    if (!result) {
      return StatusError(res, 404, 'User not found')
    }
    delete result.password
    return StatusSuccess(res, 200, 'Success user found', { ...result })
  } catch (error) {
    if (error.errors) {
      const errors = error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }))
      return StatusError(res, 400, 'Bad Request', errors)
    }
    StatusError(res, 400, 'Bad Request', error.message || error.toString())
  }
}

module.exports = {
  Login,
  CheckEmail,
}
