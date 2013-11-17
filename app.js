var irc = require('irc') 
	, _ = require('underscore');

var ws = require('ws')
	, WebSocketServer = ws.Server
	, wss = new WebSocketServer({port: 8080})
	, clients = [];

wss.on('connection', function(ws) {
		clients.push(ws);
    ws.on('message', function(message) {
        console.log('received: %s', message);
    });
    ws.send('something');
});


var client = new irc.Client('irc.freenode.net', 'pekka---', {
	channels: ['#pekkabot']
});

client.addListener('message', function (from, to, message) {
	if (clients.length > 0) {
		_.each(clients, function(client) {
			client.send({
				from: from,
				to: to,
				message: message
			});
		});
	}
  console.log(from + ' => ' + to + ': ' + message);
});