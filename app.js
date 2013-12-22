var webirc = require('./modules/webirc') 
	, config = require('./config')
	, express = require('express')
	, http = require('http')
	, app = express()
	, port = process.env.PORT || 5000;

var server = http.createServer(app)
server.listen(port);

var hook = { server: server };
webirc.start(hook, config);

