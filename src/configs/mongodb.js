const { MongoClient, ServerApiVersion } = require('mongodb')

require('dotenv').config()
const uri = process.env.DB

const client = new MongoClient(uri, {
  tls: true,
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
})

let db // untuk simpan database

async function connectDB() {
  if (!db) {
    await client.connect()
    await client.db('auth').command({ ping: 1 })
    console.log('Connected to MongoDB')
    db = client.db('auth')
  }
  return db
}

module.exports = { connectDB, db, client }
