const { z } = require('zod')
const { validationZod } = require('../helpers/zod')
const hashingHmac = require('../helpers/Hmac')
const { connectDB } = require('../configs/mongodb')
const { StatusSuccess, StatusError } = require('../helpers/Status')
const generateOTP = require('../helpers/generateOTP')
const { ObjectId } = require('mongodb')
const { generateAccessToken } = require('../helpers/jwt')
const path = require('path')
const fs = require('fs')
const handlebars = require('handlebars')
const { transporter } = require('../helpers/nodemailer')

const schemaRegister = z
  .object({
    email: z.string().email(),
    password: z.string().min(6),
    active: z.boolean().optional().default(true),
  })
  .strict()

require('dotenv').config()

async function Register(req, res) {
  try {
    const db = await connectDB()
    const { email, password } = req.body
    const checkEmail = await db.collection('users').findOne({ email })
    if (checkEmail) return StatusError(res, 400, 'Email already exists')

    await validationZod(schemaRegister, { ...req.body, active: true })
    const HashPassword = await hashingHmac(password)

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

async function readHTMLFile(data, email) {
  const { from, to } = email

  const templatePath = path.join(__dirname, '../templates/email.html')
  const source = fs.readFileSync(templatePath, 'utf8')

  const template = handlebars.compile(source)

  const htmlToSend = template(data)

  const mailOptions = {
    from,
    to,
    subject: 'Hello, this is your OTP!',
    html: htmlToSend,
  }

  return await transporter.sendMail(mailOptions)
}

async function RegisterOtp(req, res) {
  try {
    const db = await connectDB()
    const { email, password } = req.body
    const checkEmail = await db.collection('users').findOne({ email })
    if (checkEmail) return StatusError(res, 400, 'Email already exists')

    await validationZod(schemaRegister, { ...req.body, active: true })
    const HashPassword = await hashingHmac(password)

    const insertResult = await db
      .collection('users')
      .insertOne({ email, password: HashPassword, active: false })
    const tokenOtp = generateAccessToken({ otp: insertResult.insertedId }, '5d')
    const otp = generateOTP(6)
    const otpInsert = await db.collection('otp').insertOne({
      email,
      otp,
      token: tokenOtp,
      userId: insertResult.insertedId,
    })

    console.log(otpInsert, 'optinser')

    await readHTMLFile({ otp }, { from: process.env.EMAIL, to: email })

    return StatusSuccess(res, 200, 'Success registration', {
      otp: insertResult.insertedId,
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

module.exports = { Register, RegisterOtp }
