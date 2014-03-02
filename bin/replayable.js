var WebSocket = require('ws');

var config = {
	server: {
		port: 8081
	},
	proxy: {
		url: 'ws://localhost',
		port: 8080
	}
};

console.log('[SERVER] Starting Replayable websocket server');
var server = new WebSocket.Server({ port: config.server.port });

server.on('connection', function (client) {
	console.log('[SERVER] Connection received');

	console.log('[PROXY] Setting up proxy for client');
	var proxy = new WebSocket(config.proxy.url + ':' + config.proxy.port);

	proxy.on('open', function() {
		console.log('[PROXY] Proxy discovered');
	});

	proxy.on('message', function(data) {
		client.send(data);
	});
	client.on('message', function(data) {
		proxy.send(data);
	});
});


