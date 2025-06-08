const { z } = require('zod')
const { validationZod } = require('../helpers/zod')
const hashingHmac = require('../helpers/Hmac')
const { connectDB } = require('../configs/mongodb')

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
    if (checkEmail)
      return res.status(400).json({
        code: 400,
        message: 'Email already exists',
      })
    await validationZod(schemaRegister, req.body)
    const HashPassword = await hashingHmac(password)
    await db.collection('users').insertOne({ email, password: HashPassword })
    const result = await db.collection('users').findOne({ email })
    return res.status(200).json({
      code: 200,
      message: 'Success',
      data: { id: result.insertedId, email },
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

module.exports = { Register }
