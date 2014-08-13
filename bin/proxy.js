var webirc = require('../modules/webirc')
 , _ = require('underscore')
 , parseConfig = require('../modules/parse-config.js')
 , argv = process.argv

var config = parseConfig.parse(argv)

console.log(proxy)

var proxy = webirc();
proxy.useOut(function(res,req,next) {
  console.log('Middleware!: ' + res, req);
  next();
})

proxy.useIn(function(res,req,next) {
  console.log('In middleware: ' + req);
  next();
})

proxy.listen(config)
