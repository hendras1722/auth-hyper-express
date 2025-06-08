require('dotenv').config()

const express = require('express')
const Routes = require('./src/routes')
const cookieParser = require('cookie-parser')
const { connectDB } = require('./src/configs/mongodb')
const serverless = require('serverless-http')

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  res.send('ping')
})

app.use('/v1', Routes)

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' })
})

// General error handler
app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ message: 'Internal Server Error' })
})

const handler = serverless(app)

// Ekspor handler untuk serverless
module.exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false

  // Pastikan MongoDB connect (1x reuse)
  await connectDB()

  return handler(event, context)
}

// Kalau mau running lokal (misalnya: node index.js)
if (require.main === module) {
  const port = process.env.PORT || 3000
  connectDB()
    .then(() => {
      console.log('MongoDB is ready')
      app.listen(port, () => {
        console.log(`Server listening on port ${port}`)
      })
    })
    .catch(console.error)
}
