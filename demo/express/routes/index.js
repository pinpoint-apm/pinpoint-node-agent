var express = require('express')
var router = express.Router()
const axios = require('axios')
const IORedis = require('ioredis')
const ioRedis = new IORedis(6379)
const http = require('http')
const https = require('https')

let callcount = 0
/* GET home page. */
router.get('/', function (req, res, next) {

  ioRedis.set("keyio", "value", function (error) {
    console.log(`${callcount} ioredis set `)
  })
  ioRedis.get("keyio", function (error, data) {
    console.log(`${callcount} ioredis data ${data}`)
  })

  axios.get(`https://naver.com`, {
      timeout: 1000,
      httpAgent: new http.Agent({ keepAlive: false }),
      httpsAgent: new https.Agent({ keepAlive: false }),
    })
    .then(function (response) {
      console.log(`response ${response}`)
      res.render('index', { title: 'Express' })
    })
})

module.exports = router
