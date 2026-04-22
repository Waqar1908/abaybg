const express = require('express')
const path = require('path')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api', require('./routes'))

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'))
})

app.get('/style.css', (req, res) => {
  res.sendFile(path.join(__dirname, 'style.css'))
})

app.get('/script.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'script.js'))
})

app.listen(5000, () => {
  console.log('http://localhost:5000')
})