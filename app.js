var cli = require('./client');

var ws = require('ws')
	, WebSocketServer = ws.Server
	, wss = new WebSocketServer({port: 8080});


wss.on('connection', function(ws) {
		cli.proxyWebClient(ws);
    ws.on('message', function(message) {
        console.log('received: %s', message);
    });
    ws.send('something');
});

