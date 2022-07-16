require("dotenv").config();
require("express-async-errors");
const express = require("express")
const app = express()

const connectDB = require("./db/connect")

const { authRouter } = require("./route")

const PORT = process.env.PORT || 3000


app.use('/api/v1/auth', authRouter)

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