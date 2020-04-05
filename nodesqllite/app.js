  
const express = require('express')
const bodyParser = require('body-parser')
const logger = require('morgan')
const cors = require('cors')
const dotenv = require('dotenv');


//const authService = require('./auth')
//const auth = require('./api/auth')

const streamer = require('./api/streamer')
const app = express()

dotenv.config();

app.use(cors())
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static('public'))

//app.post('/login', auth.login)

// 스트리머 정보 획득및 sqlite 저장
app.post('/streamer', streamer.createCall);

// 스트리머 정보목록 조회 검색 자동완성등에 사용
app.get('/streamerSearch/:userName',streamer.query);

const startT = Date.now()
app.use('/servercheck', (_, res) => res.json({time: Date.now() - startT}))

app.use((req, res, next) => {
  res.status = 404
  next(Error('not found'))
})

app.use((err, req, res, next) => {
  console.log(err)
  res.status(res.statusCode || 500)
  res.json({ error: err.message || 'internal server error' })
})

module.exports = app