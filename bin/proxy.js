var magrathea = require('../index')
 , _ = require('underscore')
 , parseConfig = require('../lib/parse-config.js')
 , argv = process.argv

var config = parseConfig.parse(argv)

console.log(proxy)

var proxy = magrathea();
proxy.useOut(function(res,req,next) {
  console.log('Middleware!: ' + res, req);
  next();
})

proxy.useIn(function(res,req,next) {
  console.log('In middleware: ' + req);
  next();
})

proxy.listen(config)
