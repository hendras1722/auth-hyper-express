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
