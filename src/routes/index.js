const express = require('express')
const { Login, CheckEmail } = require('../controller/login')
const { Register, RegisterOtp } = require('../controller/register')
const auth = require('../helpers/authenticate')
const { RefreshToken } = require('../controller/refreshToken')
const { MethodPOST, MethodGET } = require('../helpers/method')
const { Logout } = require('../controller/logout')
const { OtpToken, GenerateOTPToken } = require('../controller/otp')
const rateLimit = require('express-rate-limit')
const { GetMe } = require('../controller/profile')

const Routes = express.Router()

const limiter = rateLimit({
  windowMs: 2 * 60 * 1000, // 2 minutes
  max: 1, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later.',
  handler: (req, res) => {
    res.status(400).json({
      code: 429,
      message: 'Too many requests, please try again later.',
    })
  },
})

Routes.use('/auth/login', MethodPOST, Login)
Routes.use('/auth/register', MethodPOST, Register)
Routes.use('/auth/register-otp', MethodPOST, limiter, RegisterOtp)
Routes.use('/auth/refresh-token', MethodGET, RefreshToken)
Routes.use('/auth/logout', MethodGET, Logout)
Routes.use('/auth/otp', MethodPOST, OtpToken)
Routes.use('/auth/generate-otp', MethodPOST, limiter, GenerateOTPToken)
Routes.use('/getme', MethodGET, GetMe)
Routes.use('/auth/check-email', MethodPOST, CheckEmail)

module.exports = Routes
