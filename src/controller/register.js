const { z } = require('zod')
const { validationZod } = require('../helpers/zod')
const hashingHmac = require('../helpers/Hmac')
const { connectDB } = require('../configs/mongodb')
const { StatusSuccess, StatusError } = require('../helpers/Status')
const generateOTP = require('../helpers/generateOTP')
const { ObjectId } = require('mongodb')

const { generateAccessToken } = require('../helpers/jwt')

const schemaRegister = z
  .object({
    email: z.string().email(),
    password: z.string().min(6),
    active: z.boolean(),
  })
  .strict()

async function Register(req, res) {
  try {
    const db = await connectDB()
    const { email, password } = req.body
    const checkEmail = await db.collection('users').findOne({ email })
    if (checkEmail) return StatusError(res, 400, 'Email already exists')

    await validationZod(schemaRegister, { ...req.body, active: true })
    const HashPassword = await hashingHmac(password)

    if (req.query.otp) {
      const insertResult = await db
        .collection('users')
        .insertOne({ email, password: HashPassword, active: false })
      const tokenOtp = generateAccessToken(
        { otp: insertResult.insertedId },
        '5d'
      )
      const otpInsert = await db.collection('otp').insertOne({
        email,
        otp: generateOTP(6),
        token: tokenOtp,
        userId: insertResult.insertedId,
      })

      return StatusSuccess(res, 200, 'Success registration', {
        otp: otpInsert.insertedId,
      })
    }

    const insertResult = await db
      .collection('users')
      .insertOne({ email, password: HashPassword, active: true })

    return StatusSuccess(res, 200, 'Success', {
      id: insertResult.insertedId,
      email,
    })
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

module.exports = { Register }
