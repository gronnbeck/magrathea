var cli = require('./client')
, _ = require('underscore')
, wsClient = require('./ws-endpoint-client');

var default_config = {};

var start = function(hook, config) {
	if (hook == null) {	
		hook = { port: 1881 };
	}

	var client = cli.init(config.proxies.IRCProxy);

	var ws = require('ws')
	, WebSocketServer = ws.Server
	, wss = new WebSocketServer(hook);



	wss.on('connection', function(ws) {
		console.log('Connection received from [IP]');

		ws.send('Connection received. Looking for your IRC connections');

		client.proxyWebClient( 'test', '1337-hash', wsClient.init( ws ) );
		ws.on('message', function(message) {
			console.log('received: %s', message);
		});

	});
};

exports.start = function(hook, config) {
	start(hook, _.defaults(config, default_config));
};

