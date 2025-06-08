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
    await validationZod(schemaRegister, req.body)
    const HashPassword = await hashingHmac(password)
    await db.collection('users').insertOne(req.body)
    return res.status(200).json({
      code: 200,
      message: 'Success',
      data: { email, password: HashPassword },
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
