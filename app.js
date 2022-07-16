require("dotenv").config()
const express = require("express")

const app = express()

const PORT = process.env.PORT || 3000


const start = async () => {
  try {
    app.listen(PORT, () => {
      console.log(`server is listening at http://localhost:${PORT}`)
    })
  } catch(err) {
      console.log(err)
  }
}

start()