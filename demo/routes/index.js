var express = require('express');
var router = express.Router();

const IORedis = require('ioredis');
const ioRedis = new IORedis(6379)

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
