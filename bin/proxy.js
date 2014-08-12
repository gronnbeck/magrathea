var webirc = require('../modules/webirc')
 , _ = require('underscore')
 , parseConfig = require('../modules/parse-config.js')
 , argv = process.argv

var config = parseConfig.parse(argv)

var proxy = webirc();
proxy.use(function(res,req,next) {
  console.log('Middleware!: ' + res, req);
  next();
})
proxy.start(config)
