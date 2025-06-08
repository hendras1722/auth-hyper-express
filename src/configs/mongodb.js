const { MongoClient, ServerApiVersion } = require('mongodb')

const uri =
  'mongodb+srv://muhsyahendraa1722:u8roK9xYomzALgAB@auth.grdevij.mongodb.net/?retryWrites=true&w=majority&appName=auth'

const client = new MongoClient(uri, {
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
