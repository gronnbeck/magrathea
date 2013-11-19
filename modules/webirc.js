var cli = require('./client');

exports.start = function() {

	var ws = require('ws')
		, WebSocketServer = ws.Server
		, wss = new WebSocketServer({port: 1881});


	wss.on('connection', function(ws) {
		console.log('Connection received from [IP]');

		ws.send('Connection received. Looking for your IRC connections');

		cli.proxyWebClient( 'test', '1337-hash', ws );
	    ws.on('message', function(message) {
	        console.log('received: %s', message);
	    });
	    
	});
}