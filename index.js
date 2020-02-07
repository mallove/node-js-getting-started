var util = require('util')

const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

express()
  .use(express.static(path.join(__dirname, 'public')))
  .use(express.static(path.join(__dirname, 'public/.well-known/acme-challenge'), {index: true}))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))

var url   = require('url');
var Redis = require('ioredis');

try {
  redis_uri = url.parse(process.env.REDIS_URL);

  console.log("EAM trace, index.js:13, process.env = " + util.inspect(process.env));
  console.log("EAM trace, index.js:13, redis_uri  = " + util.inspect(redis_uri ));

  var redis_port = Number(redis_uri.port);
  if (process.env.STUNNEL_ENABLED) {
    redis_port = Number(redis_uri.port) + 1;
  }

  var redis_params = {
    port: redis_port,
    host: redis_uri.hostname,
    password: redis_uri.auth.split(':')[1],
    db: 0
  };

  // Add security, if requested
  if (process.env.STUNNEL_ENABLED) {
    redis_params.tls = {
      rejectUnauthorized: false,
      requestCert: true,
      agent: false
    };
  }

  console.log("EAM trace, index.js:50, redis_params = " + util.inspect(redis_params));

  var redis = new Redis(redis_params);

  redis.on("connect", function (msg) {
      console.log("trace, msg = " + util.inspect(msg));
      console.log("Connected!");
  });

  redis.ping("PING").then(function(result) {
    console.log(result);
    // process.exit();
  });

  redis.set("foo", "bar");
  redis.get("foo", function(err, result) {
    console.log(result);
  });

} catch (e) {
  console.trace(e);
}
// 
// /////////////////////////////////////////////
// 
// console.log("EAM trace, index.js:68, process.env.REDIS_URL = " + util.inspect(process.env.REDIS_URL));

