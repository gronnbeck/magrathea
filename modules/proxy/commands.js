var _ = require('underscore');

exports.init = function(ws, connections) {

	var establish =  function(connection) {
		var client = connection.client
		ws.send( JSON.stringify({ type: 'connected', key: connection.key }) )

		client.on('msg', function(msg) {
			ws.send(
				JSON.stringify(
					_.defaults(msg, { key: connection.key })
					)
			)
		})

		ws.on('close', function() {
			client.removeAllListeners();
		})
	}

	return {
		connect: function(message) {
			var config = message.connection
			, connection = connections.create(config);
			establish(connection);
		},
		reconnect: function(message) {
			var key = message.key;
			if (connections.has(key)) {
				var connection = connections.get(key);
				establish(connection);
			}
			else {
				ws.send(JSON.stringify({
					success: false,
					type: 'disconnected',
					msg: 'The connection you are referencing does not exists'
				}));
			}
		},
		msg: function(message) {
			if (connections.has(message.key)) {
				var conn = connections.get(message.key);
				if (conn.key == message.key) {
					conn.client.emit('send', message);
				}
			}
		},
		disconnect: function(message) {
			console.log('Disconenct not implemented. Exiting');
			process.kill();
		}
	}
};
