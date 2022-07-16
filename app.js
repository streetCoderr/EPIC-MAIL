require("dotenv").config()
const express = require("express")

const connectDB = require("./db/connect")

const app = express()

const PORT = process.env.PORT || 3000


const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(PORT, () => {
      console.log(`server is listening at http://localhost:${PORT}`)
    })
  } catch(err) {
      console.log(err)
  }
}

start()