var cli = require('./client');

var ws = require('ws')
	, WebSocketServer = ws.Server
	, wss = new WebSocketServer({port: 1881});


wss.on('connection', function(ws) {
	console.log('Connection received from [IP]');
	cli.proxyWebClient(ws);
    ws.on('message', function(message) {
        console.log('received: %s', message);
    });
    ws.send('something');

});

