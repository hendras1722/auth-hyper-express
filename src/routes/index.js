const express = require('express')
const { Login } = require('../controller/login')
const { Register, RegisterOtp } = require('../controller/register')
const auth = require('../helpers/authenticate')
const { RefreshToken } = require('../controller/refreshToken')
const { MethodPOST, MethodGET } = require('../helpers/method')
const { Logout } = require('../controller/logout')
const { OtpToken, GenerateOTPToken } = require('../controller/otp')

const Routes = express.Router()

Routes.use('/auth/login', MethodPOST, Login)
Routes.use('/auth/register', MethodPOST, Register)
Routes.use('/auth/register-otp', MethodPOST, RegisterOtp)
Routes.use('/auth/refresh-token', MethodGET, RefreshToken)
Routes.use('/auth/logout', MethodGET, Logout)
Routes.use('/auth/otp', MethodPOST, OtpToken)
Routes.use('/auth/generate-otp', MethodPOST, GenerateOTPToken)

module.exports = Routes
