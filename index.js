const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

var util = require('util')
console.log("index.js:6, process.env = " + util.inspect(process.env));

var url   = require('url');
var Redis = require('ioredis');

process.env.REDIS_URL = "redis://h:p1a5c9e67cd6ffb23967d919165df93932f3b55dce981ef0a989adb738d977258@ec2-3-225-119-109.compute-1.amazonaws.com:27899";
process.env.REDIS_URL_STUNNEL = "redis://h:p1a5c9e67cd6ffb23967d919165df93932f3b55dce981ef0a989adb738d977258@ec2-3-225-119-109.compute-1.amazonaws.com:27900";

console.log("EAM trace, index.js:14, process.env.REDIS_URL = " + util.inspect(process.env.REDIS_URL));

/////////////////////////////////////////////
try {
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

  redis.on("connect", function (msg) {
      console.log("trace, msg = " + util.inspect(msg));
      console.log("Connected!");
  });

  redis.ping("PING").then(function(result) {
    console.log(result);
    process.exit();
  });

  redis.set("foo", "bar");
  redis.get("foo", function(err, result) {
    console.log(result);
  });

} catch (e) {
  console.trace(e);
}


/////////////////////////////////////////////

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
