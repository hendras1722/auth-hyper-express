require('dotenv').config()

const express = require('express')
const Routes = require('./src/routes')
const cookieParser = require('cookie-parser')
const { connectDB } = require('./src/configs/mongodb')
const { StatusError } = require('./src/helpers/Status')

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
  StatusError(res, 404, 'Route not found', 'Oh You are lost')
})

// General error handler
app.use((err, req, res, next) => {
  console.error(err)
  StatusError(res, 404, 'Internal Server Error', 'Something wrong!')
})

// MongoDB connect middleware
app.use(async (req, res, next) => {
  try {
    await connectDB()
    next()
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'MongoDB connect failed' })
  }
})

if (require.main === module) {
  const port = process.env.PORT || 3000
  connectDB().then(() => {
    console.log('MongoDB is ready')
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`)
    })
  })
}

module.exports = app
