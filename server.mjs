import express from 'express'

const app = express()

const port = process.env.PORT || 3000

console.log(port)

app.listen(port, () => {
    console.log(`🚀 Running NON-SECURE server (${port} - ${process.env.NODE_ENV})`)
  })