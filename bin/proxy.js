var proxy = require('../modules/proxy/proxy.js')
 , _ = require('underscore')
 , parseConfig = require('../modules/parse-config.js')
 , argv = process.argv

var config = parseConfig.parse(argv)

proxy.start(config)
