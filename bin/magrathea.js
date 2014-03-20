#!/usr/local/bin/node

var WebSocket = require('ws')
, fs = require('fs')
, _ = require('underscore');

var port = 8080;
if (process.argv.length > 2) {
	var cand = _.filter(process.argv,
		function (str) { return str.indexOf('port') >= 0 })
	if (!_.isEmpty(cand)) port = cand[0].split('=')[1]
}

var config = {
	url: 'ws://localhost',
	port: port
};

var establishConnection = function(ws) {
	ws.send( JSON.stringify({
		type: 'connect',
		connection: {
			server: 'irc.freenode.net',
			nick: 'nplol-magrathea',
			channels: ['#nplol', '#pekkabot']
		}
	}));
}

var url = config.url + ':' + config.port
console.log('Establishing connection to ' + url)
var ws = new WebSocket(url);

ws.on('open', function() {
	console.log('[ws] ws discovered');

	// look for saved connection key
	fs.readFile('magrathea.key', function(err, data) {
		// establish new connection if no key is found
		if (err) {
			establishConnection(ws);
			return;
		}

		// try to ro reconnect using the saved key
		var key = data.toString();
		ws.send( JSON.stringify({
			type: 'reconnect',
			key: key
		}));
	});
});

ws.on('message', function(data) {
	console.log(data);
	var message = JSON.parse(data);
	// establish new connection if it did not exist
	if (message.success == false && message.type == 'disconnected') {
		establishConnection(ws);
	}

	else if (message.type == 'connected') {
		fs.writeFile('magrathea.key', message.key, function (err) {
			if (err)
			console.log('Error occured when trying to save connection key: ' + err);
		});
	}
	else if (message.type == 'msg') {
		if (message.from == 'nplol-bot-marvin') {
			ws.send(JSON.stringify({
				key: message.key,
				type: 'msg',
				to: message.to,
				payload: 'Please ignore Marvin. He is depressed.'
			}));
		}
	}
});

ws.on('close', function() {
	console.log('ws closed. Handle reconnection.');
});
