const { z } = require('zod')
const { validationZod } = require('../helpers/zod')
const hashingHmac = require('../helpers/Hmac')
const { connectDB } = require('../configs/mongodb')
const { StatusSuccess, StatusError } = require('../helpers/Status')

const schemaRegister = z
  .object({
    email: z.string().email(),
    password: z.string().min(6),
  })
  .strict()

async function Register(req, res) {
  try {
    const db = await connectDB()
    const { email, password } = req.body
    const checkEmail = await db.collection('users').findOne({ email })
    if (checkEmail) return StatusError(res, 400, 'Email already exists')

    await validationZod(schemaRegister, req.body)
    const HashPassword = await hashingHmac(password)
    const insertResult = await db
      .collection('users')
      .insertOne({ email, password: HashPassword })

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
