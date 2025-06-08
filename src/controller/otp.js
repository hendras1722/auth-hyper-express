const { connectDB } = require('../configs/mongodb')
const { StatusSuccess, StatusError } = require('../helpers/Status')
const { ObjectId } = require('mongodb')
const jwt = require('jsonwebtoken')
const generateOTP = require('../helpers/generateOTP')
const { generateAccessToken } = require('../helpers/jwt')

require('dotenv').config()
async function OtpToken(req, res) {
  try {
    const db = await connectDB()
    const { otp, id } = req.body
    const db_otp = await db
      .collection('otp')
      .findOne({ userId: ObjectId.createFromHexString(id) })

    const isJwtValid = jwt.verify(db_otp.token, process.env.JWT_KEY)

    if (!db_otp) return StatusError(res, 404, 'Otp not found')
    if (db_otp.otp !== otp) return StatusError(res, 400, 'Invalid otp')
    if (isJwtValid.exp < Math.floor(Date.now() / 1000))
      return StatusError(res, 400, 'Otp expired')

    const userId = db_otp.userId
    const result = await db
      .collection('users')
      .updateOne({ _id: userId }, { $set: { active: true } })

    if (result.matchedCount === 0)
      return StatusError(res, 404, { code: 404, message: 'User not found' })

    await db
      .collection('otp')
      .deleteOne({ userId: ObjectId.createFromHexString(id) })

    return StatusSuccess(res, 200, 'Success', {
      code: 200,
      message: 'Success otp verified',
      data: null,
    })
  } catch (error) {
    return StatusError(
      res,
      400,
      'Bad Request',
      error.message || error.toString()
    )
  }
}

async function GenerateOTPToken(req, res) {
  try {
    const db = await connectDB()
    const { email } = req.body
    const checkEmail = await db.collection('otp').findOne({ email })
    if (!checkEmail) return StatusError(res, 404, 'Otp not found')
    if (checkEmail) {
      await db
        .collection('otp')
        .updateOne({ email }, { $set: { otp: generateOTP(6) } })
      const generateIdOTP = await db.collection('otp').findOne({ email })
      console.log(generateIdOTP)
      return StatusSuccess(res, 200, 'Success', {
        otp: generateIdOTP.userId,
      })
    }
  } catch (error) {
    return StatusError(
      res,
      400,
      'Bad Request',
      error.message || error.toString()
    )
  }
}

module.exports = { OtpToken, GenerateOTPToken }
