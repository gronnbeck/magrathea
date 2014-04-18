var _ = require('underscore');

exports.init = function(ws, connections) {

	var establish =  function(connection, raw) {
		console.log('Establiash connection')
		console.log('  Connection: ' + JSON.stringify(connection))
		console.log('  Raw: ' + raw )

		var client = connection.client
		ws.send( JSON.stringify({ type: 'connected', key: connection.key }) )

		var msg = function(msg) {
			ws.send(JSON.stringify(_.defaults(msg, { key: connection.key })))
		}
		, raw = function(msg) {
			ws.send(JSON.stringify(_.defaults(msg, { type: 'raw', key: connection.key })))
		}

		var map = [
			{ event: 'msg', listener: msg },
			{ event: 'raw', listener: raw }
		]

		client.on('msg', msg)

		if (raw) {
			client.on('raw', raw)
		}

		ws.on('close', function() {
			console.log('Connection closed: ' + connection.key)
			map.forEach(function(mapping) {
					client.removeListener(mapping.event, mapping.listener);
			})

		})
	}
	, msg = function(message) {
		if (connections.has(message.key)) {
			var conn = connections.get(message.key);
			if (conn.key == message.key) {
				console.log('weeeelll')
				console.log(conn)
				conn.client.emit('send', message);
			} else {
				ws.send(JSON.stringify({
					type: 'error',
					payload: 'Connection with key ('+ message.key + ')' +
						'does not exist'
				}))
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
					key: key,
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
