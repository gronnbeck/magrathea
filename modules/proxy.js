var _ = require('underscore')
, webSocket = require('ws')
, container = require('./container');

var defaults = {
	port: 8080
};

exports.start = function(configure) {
	var config = _.defaults(configure || {}, defaults);

	var wss = new webSocket.Server({ port: config.port })
	, connectionContainer = container.Connection();

	wss.on('connection', function (ws) {

		ws.on('message', function (msg) {
			var message = JSON.parse(msg);
			if (message.type == 'connect') {
				var config = message.connection
				, key = message.key || ''
				, connection = connectionContainer.retreiveOrCreate(key, config)
				, client = connection.client;

				client.on('msg', function(msg) {
					ws.send(JSON.stringify(msg));
				});
				
				ws.on('message', function (msg) {
					client.emit('send', JSON.parse(msg));
				});
			}
		});
	});	
};




