const express = require('express')
const app = express()
require('dotenv').config()


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/thelite', (req, res) => {
    res.send("<h1>this is The Thelite Page</h1>")
  })
  

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port`)
})