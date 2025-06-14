const swaggerJSDoc = require('swagger-jsdoc')

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'My API',
    version: '1.0.0',
    description: 'My API Description',
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  servers: [
    { url: 'https://auth.syahendra.com' },
    { url: 'http://localhost:3000' },
  ],
}

const options = {
  swaggerDefinition,
  apis: ['src/routes/swagger.js'],
}

const swaggerSpec = swaggerJSDoc(options)
module.exports = swaggerSpec
