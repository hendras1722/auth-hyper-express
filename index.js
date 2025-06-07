const express = require('express')
const Routes = require('./src/routes')
const cookieParser = require('cookie-parser')
const app = express()
const port = 3000

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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
