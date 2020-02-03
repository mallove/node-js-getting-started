const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

var util = require('util')
console.log("index.js:6, process.env = " + util.inspect(process.env));

var url   = require('url');
var Redis = require('ioredis');

/////////////////////////////////////////////
redis_uri = url.parse(process.env.REDIS_URL);
var redis = new Redis({
  port: Number(redis_uri.port) + 1,
  host: redis_uri.hostname,
  password: redis_uri.auth.split(':')[1],
  db: 0,
  tls: {
    rejectUnauthorized: false,
    requestCert: true,
    agent: false
  }
});
/////////////////////////////////////////////

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
