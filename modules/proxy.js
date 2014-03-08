var _ = require('underscore')
, webSocket = require('ws')
, container = require('./container');

var defaults = {
	port: 8080
};

var establish = function(ws, connection) {
	var client = connection.client;
	ws.send( JSON.stringify({ type: 'connected', key: connection.key }) );

	client.on('msg', function(msg) {
		ws.send(JSON.stringify(msg));
	});
	
	ws.on('message', function (msg) {
		client.emit('send', JSON.parse(msg));
	});

	ws.on('close', function() {
		client.removeAllListeners();
	});
};

exports.start = function(configure) {
	var config = _.defaults(configure || {}, defaults)
	, wss = new webSocket.Server({ port: config.port })
	, connections = container.Connection();

	console.log('Starting proxy');
	wss.on('connection', function (ws) {
		var commands = {
			connect: function(message) {
				var config = message.connection
				, connection = connections.create(config);
				establish(ws, connection);
			},
			reconnect: function(message) {
				var key = message.key;
				if (connections.has(key)) {
					var connection = connections.get(key);
					establish(ws, connection);
				} 
				else {
					ws.send(JSON.stringify({ 
						success: false, 
						type: 'disconnected', 
						msg: 'The connection you are referencing does not exists'
					}));
				}
			},
			disconnect: function(message) {
				console.log('Disconenct not implemented. Exiting');
				process.kill();
			}
		};

		console.log("Connection received from " + ws);
		ws.on('message', function (msg) {
			var message = JSON.parse(msg);

			if (_.has(commands, message.type)) 
				commands[message.type](message);
			else {
				ws.send(JSON.stringify({
					success: false,
					type: 'unknown command',
					msg: message.type +'" command does not exist'
				}));
			}
		});
	});	
};




