var _ = require('underscore')
, webSocket = require('ws')
, wss = new webSocket.Server({ port: 8080 })
, container = require('./container')
, connectionContainer = container.Connection();


exports.start = function() {
	wss.on('connection', function (ws) {
		var config = { server: 'irc.freenode.net', nick: 'tester-irc-proxy-', channels: ['#nplol', '#pekkabot'] }
		, key = 'what-an-unique-key'
		, connection = connectionContainer.retreiveOrCreate(key, config)
		, client = connection.client;

		client.on('msg', function(msg) {
			ws.send(JSON.stringify(msg));
		});

		ws.on('message', function (msg) {
			client.emit('send', JSON.parse(msg));
		});
	});	
};




