const { connectDB } = require('../configs/mongodb')
const { StatusSuccess, StatusError } = require('../helpers/Status')
const jwt = require('jsonwebtoken')
const { ObjectId } = require('mongodb')

async function GetMe(req, res) {
  try {
    const db = await connectDB()
    const authorization = req.headers.authorization
    if (!authorization?.includes('Bearer'))
      return StatusError(res, 401, 'Unauthorized')
    const token = authorization.split(' ')[1]
    console.log(token)
    const decoded = jwt.verify(token, 'secret')
    const expired = decoded.exp * 1000
    if (expired < Date.now()) return StatusError(res, 401, 'Unauthorized')

    const profile = await db
      .collection('users')
      .findOne(
        { _id: new ObjectId(decoded.id) },
        { projection: { password: 0 } }
      )

    if (!profile) return StatusError(res, 404, 'User not found')
    return StatusSuccess(res, 200, 'Success', profile)
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

module.exports = {
  GetMe,
}
