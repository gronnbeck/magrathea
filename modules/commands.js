var _ = require('underscore');

exports.init = function(ws, connections) {

	var establish =  function(connection, raw) {
		var client = connection.client
		ws.send( JSON.stringify({ type: 'connected', key: connection.key }) )

		client.on('msg', function(msg) {
			ws.send(JSON.stringify(_.defaults(msg, { key: connection.key })))
		})

		if (raw) {
			client.on('raw', function(msg) {
				ws.send(JSON.stringify(_.defaults(msg, { type: 'raw', key: connection.key })))
			})
		}

		ws.on('close', function() {
			client.removeAllListeners();
		})
	}
	,msg = function(message) {
		if (connections.has(message.key)) {
			var conn = connections.get(message.key);
			if (conn.key == message.key) {
				conn.client.emit('send', message);
			}
		}
	}

	return {
		connect: function(message) {
			var config = message.connection
			, raw = message.raw || false
			, connection = connections.create(config);

			establish(connection, raw);
		},
		reconnect: function(message) {
			var key = message.key
			, raw = message.raw || false

			if (connections.has(key)) {
				var connection = connections.get(key);
				establish(connection, raw);
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
			msg(message)
		},
		raw: function(message) {
			msg(message)
		},
		disconnect: function(message) {
			console.log('Disconenct not implemented. Exiting');
			process.kill();
		}
	}
};
