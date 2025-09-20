require('dotenv').config()

const { Server } = require('hyper-express')
const Routes = require('./src/routes')
const { connectDB } = require('./src/configs/mongodb')
const { StatusError } = require('./src/helpers/Status')
const swaggerUI = require('swagger-ui-express')
const swaggerSpec = require('./src/configs/swagger')
const cors = require('cors')
const path = require('path')

const app = new Server()

// Middleware to connect to MongoDB
// In Hyper-Express, you DO NOT call next() in an async middleware.
// It automatically proceeds when the promise resolves.
app.use(async (req, res) => {
  try {
    await connectDB()
  } catch (err) {
    console.error(err)
    // Stop the request by sending a response
    res.status(500).json({ message: 'MongoDB connect failed' })
  }
})

// CORS Middleware
app.use(cors())

// Static files route
app.get('/public/*', (req, res) => {
  res.sendFile(path.join(__dirname, req.path))
})

// API Routes
app.use('/v1', Routes)

// Root ping route
app.get('/', (req, res) => {
  res.send('ping')
})

// Swagger Docs
app.get('/swagger', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>The Cookies API Documentation</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css" />
      </head>
      <body>
        <div id="swagger-ui"></div>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.js"></script>
        <script>
          window.onload = () => {
            SwaggerUIBundle({
              url: '/swagger.json', // serve JSON kamu di sini
              dom_id: '#swagger-ui',
              deepLinking: true,
              presets: [SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset],
              layout: "BaseLayout"
            });
          };
        </script>
      </body>
    </html>
  `);
});

// ✅ Serve JSON spec
app.get('/swagger.json', (req, res) => {
  res.json(swaggerSpec);
});

// 404 Handler
app.set_not_found_handler((req, res) => {
  StatusError(res, 404, 'Route not found', 'Oh You are lost')
})

// Global Error Handler
app.set_error_handler((req, res, error) => {
  console.error(error)
  StatusError(res, 500, 'Internal Server Error', 'Something wrong!')
})

if (require.main === module) {
  const port = process.env.PORT || 3001
  connectDB()
    .then(() => {
      console.log('MongoDB is ready')
      app
        .listen(port)
        .then(() => {
          console.log(`Server listening on port ${port}`)
        })
        .catch((error) => {
          console.error(`Failed to start server: ${error}`)
          process.exit(1)
        })
    })
    .catch((err) => {
      console.error('Failed to connect to MongoDB', err)
      process.exit(1)
    })
}

module.exports = app
