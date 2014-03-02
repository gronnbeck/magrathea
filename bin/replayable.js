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

console.log('[PROXY] Looking for proxy')
var proxy = new WebSocket(config.proxy.url + ':' + config.proxy.port);

server.on('connection', function (client) {
	console.log('[SERVER] Connection received');
	client.on('message', function(data) {
		proxy.send(data);
	});
});


proxy.on('open', function() {
	console.log('[PROXY] Proxy discovered');
	proxy.send(JSON.stringify({ 
		type: 'connect', 
		connection: {
			server: 'irc.freenode.net', 
			nick: 'tester-irc-proxy', 
			channels: ['#nplol', '#pekkabot'] 
		},
		key: null
	}));
});

proxy.on('message', function(data) {
	console.log(data);
});