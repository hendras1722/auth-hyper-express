const express = require('express')
const Routes = require('./src/routes')
const cookieParser = require('cookie-parser')
const { connectDB, client } = require('./src/configs/mongodb')
const app = express()
const port = 3000

app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  res.send('ping')
})
connectDB()
  .then(() => {
    console.log('MongoDB is ready')

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

    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`)
    })
  })
  .catch(console.error)

// Tutup MongoDB ketika server mati
process.on('SIGINT', async () => {
  console.log('Closing MongoDB connection...')
  await client.close()
  process.exit(0)
})
