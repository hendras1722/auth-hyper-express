const { Router } = require('hyper-express')
const { Login, CheckEmail } = require('../controller/login')
const { Register, RegisterOtp } = require('../controller/register')
const { RefreshToken } = require('../controller/refreshToken')
const { Logout } = require('../controller/logout')
const { OtpToken, GenerateOTPToken } = require('../controller/otp')
const { GetMe } = require('../controller/profile')
const { expressToHyper, rateLimit } = require('../helpers/expressRateLimitWrapper')
const auth = require('../helpers/authenticate')
const { RegisterOtpRoute } = require('./register-otp')

const Routes = new Router()

const limiter = rateLimit({
  windowMs: 2 * 60 * 1000, // 2 minutes
  max: 3, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later.',
  handler: (req, res) => {
    res.status(400).json({
      code: 429,
      message: 'Too many requests, please try again later.',
    })
  },
})

// Create a rate limiter using the express-rate-limit wrapper
const otpLimiter = expressToHyper(limiter);

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
 *                 example: 'user@example.com'
 *               password:
 *                 type: string
 *                 example: 'password123'
 *     responses:
 *       200:
 *         description: Successful response
 */
Routes.post('/auth/login', Login)

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
 *                 example: 'user@example.com'
 *               password:
 *                 type: string
 *                 example: 'password123'
 *     responses:
 *       200:
 *         description: Successful response
 */
Routes.post('/auth/register', Register)

/**
 * @swagger
 * /v1/auth/register-otp:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Register user and send OTP
 *     description: Creates a new user (inactive) and sends an OTP to their email for verification. Subject to rate limiting.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: 'user@example.com'
 *               password:
 *                 type: string
 *                 example: 'password123'
 *     responses:
 *       200:
 *         description: OTP sent successfully. The `otp` field in the response is the user ID to be used in the /auth/otp step.
 *       429:
 *         description: Too many requests.
 */
Routes.use('/auth/register-otp', otpLimiter, RegisterOtpRoute)

/**
 * @swagger
 * /v1/auth/refresh-token:
 *   get:
 *     tags:
 *       - Auth
 *     summary: Get a new access token using a refresh token
 *     description: The refresh token must be sent as an httpOnly cookie.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successful response
 */
Routes.get('/auth/refresh-token', RefreshToken)

/**
 * @swagger
 * /v1/auth/logout:
 *   get:
 *     summary: Logout user
 *     tags:
 *       - Auth
 *     description: Clears the refresh token cookie.
 *     responses:
 *       200:
 *         description: Logout successful
 */
Routes.get('/auth/logout', Logout)

/**
 * @swagger
 * /v1/auth/otp:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Verify OTP
 *     description: Verify the OTP to activate a new user account.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               otp:
 *                 type: string
 *                 example: '123456'
 *               id:
 *                 type: string
 *                 example: '60c72b2f9b1d8c001f8e4d1c'
 *     responses:
 *       200:
 *         description: OTP verified successfully, user is now active.
 */
Routes.post('/auth/otp', OtpToken)

/**
 * @swagger
 * /v1/auth/generate-otp:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Resend OTP
 *     description: Generates and sends a new OTP to a user's email. Subject to rate limiting.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: 'user@example.com'
 *     responses:
 *       200:
 *         description: New OTP sent successfully.
 *       429:
 *         description: Too many requests.
 */
Routes.use('/auth/generate-otp', limiter, GenerateOTPToken)

/**
 * @swagger
 * /v1/getme:
 *   get:
 *     tags:
 *       - Profile
 *     summary: Get current user profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successful response
 */
Routes.use('/getme', auth, GetMe)

/**
 * @swagger
 * /v1/auth/check-email:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Check if an email is already registered
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: 'user@example.com'
 *     responses:
 *       200:
 *         description: User found
 *       404:
 *         description: User not found
 */
Routes.post('/auth/check-email', CheckEmail)

module.exports = Routes
