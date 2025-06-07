const express = require('express')
const { Login } = require('../controller/login')
const { Register } = require('../controller/register')
const auth = require('../helpers/authenticate')
const { RefreshToken } = require('../controller/refreshToken')
const { MethodPOST, MethodGET } = require('../helpers/method')

const Routes = express.Router()

Routes.use('/auth/login', MethodPOST, Login)
Routes.use('/auth/register', MethodPOST, Register)
Routes.use('/auth/refresh-token', MethodGET, RefreshToken)

module.exports = Routes
