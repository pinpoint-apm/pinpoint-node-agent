var express = require('express')
var router = express.Router()
const axios = require('axios')
// const localStorage = require('pinpoint-node-agent/lib/instrumentation/context/local-storage')

// const IORedis = require('ioredis')
// const ioRedis = new IORedis(6379)

const mysql = require('mysql')
// const { MongoClient } = require('mongodb')

const pool = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'user',
  password: 'password-pinpoint',
  database: 'sample',
  port: 33066
})

/* GET home page. */
router.get('/', async function(req, res, next) {
  // ioRedis.set("keyio", "value", function(error) {
  //   // console.log(`ioredis set `)
  // })
  // ioRedis.get("keyio", function(error, data) {
  //   // console.log(`ioredis data ${data}`)
  // })

  // var connection = mysql.createConnection({
  //   host: 'localhost',
  //   user: 'user',
  //   password: 'password-pinpoint',
  //   database: 'sample',
  //   port: 33066,
  //   acquireTimeout: 1000000,
  // })

  // connection.connect()
  // const trace1 = localStorage.getStore()
  pool.query('SELECT id, name FROM users', function (error, results, fields) {
    if (error) throw error
    // console.log('The solution is: ', results[0])
  })

  pool.query('SELECT id, name FROM users WHERE id = ? AND name like ?', [1, 'name*'], async function (error, results, fields) {
    // const trace = localStorage.getStore()
    if (error) throw error
    // console.log('The solution is: ', results[0])

    pool.query('SELECT id, name FROM users WHERE name like ?', ['b*'], function (error, results, fields) {
    })

    await axios.get(`http://localhost:3000/api`)
  })

  // const response = await fetch(`http://localhost:3000/api2`)
  // const json = await response.json()
  // console.log(json)

  // const client = new MongoClient(`mongodb://localhost:27017`, { directConnection: true })
  // const result = await client.db('test1').collection('test').insertOne({ name: 'test' })
  // client.close()

  res.render('index', { title: 'Express' })
})

router.get('/api', function(req, res, next) {
  res.status(200).json({ "result": "ok" })
})

router.get('/api2', function(req, res, next) {
  res.status(200).json({ "result": "ok" })
})

module.exports = router
