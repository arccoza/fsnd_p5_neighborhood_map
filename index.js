const path = require('path')
const express = require('express')
const app = express()


app.use('/static', express.static('pub'))

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/views/index.html')
})

app.listen(5000, function () {
  console.log('App running on port 5000')
})
