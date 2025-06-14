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

/**
 * @swagger
 * /v1/auth/refresh-token:
 *   get:
 *     tags:
 *       - Auth
 *     summary: Get a refresh token
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Success
 *                 data:
 *                   type: object
 *                   properties:
 *                      accessToken:
 *                         type: string
 *                         example: ''
 */

/**
 * @swagger
 * /v1/getme:
 *   get:
 *     tags:
 *       - Profile
 *     summary: Get a refresh token
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Success
 *                 data:
 *                   type: object
 *                   properties:
 *                      _id:
 *                         type: string
 *                         example: ''
 *                      email:
 *                         type: string
 *                         example: ''
 *                      active:
 *                         type: boolean
 *                         example: false
 */

/**
 * @swagger
 * /v1/auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: login user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: ''
 *               password:
 *                 type: string
 *                 example: ''
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Success
 *                 data:
 *                   type: object
 *                   properties:
 *                      accessToken:
 *                         type: string
 *                         example: ''
 *                      refreshToken:
 *                         type: string
 *                         example: ''
 */

/**
 * @swagger
 * /v1/auth/check-email:
 *   post:
 *     tags:
 *       - Auth
 *     summary: check available user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: ''
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Success
 *                 data:
 *                   type: object
 *                   properties:
 *                      _id:
 *                        type: string
 *                        example: ''
 *                      email:
 *                        type: string
 *                        example: ''
 *                      active:
 *                         type: boolean
 *                         example: false
 */

/**
 * @swagger
 * /v1/auth/register:
 *   post:
 *     tags:
 *       - Auth
 *     summary: register user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: ''
 *               password:
 *                 type: string
 *                 example: ''
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Success
 *                 data:
 *                   type: object
 *                   properties:
 *                      id:
 *                         type: string
 *                         example: ''
 *                      email:
 *                         type: string
 *                         example: ''
 */

/**
 * @swagger
 * /v1/auth/register-otp:
 *   post:
 *     tags:
 *       - Auth
 *     summary: register user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: ''
 *               password:
 *                 type: string
 *                 example: ''
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Success
 *                 data:
 *                   type: object
 *                   properties:
 *                      otp:
 *                         type: string
 *                         example: ''
 */

/**
 * @swagger
 * /v1/auth/otp:
 *   post:
 *     tags:
 *       - Auth
 *     summary: register user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               otp:
 *                 type: string
 *                 example: ''
 *               id:
 *                 type: string
 *                 example: ''
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Success
 *                 data:
 *                   type: object
 *                   properties:
 *                      data: null
 */

// /**
//  * @swagger
//  * /v1/user/upload:
//  *   post:
//  *     summary: Upload user profile
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         multipart/form-data:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               name:
//  *                 type: string
//  *                 example: John Doe
//  *               age:
//  *                 type: integer
//  *                 example: 30
//  *               profile_picture:
//  *                 type: string
//  *                 format: binary
//  *     responses:
//  *       200:
//  *         description: Upload successful
//  */

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
