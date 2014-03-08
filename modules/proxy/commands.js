var _ = require('underscore');

exports.init = function(ws, connections) {
	return {
		connect: function(message) {
			var config = message.connection
			, connection = connections.create(config);
			this.establish(connection);
		},
		reconnect: function(message) {
			var key = message.key;
			if (connections.has(key)) {
				var connection = connections.get(key);
				this.establish(connection);
			} 
			else {
				ws.send(JSON.stringify({ 
					success: false, 
					type: 'disconnected', 
					msg: 'The connection you are referencing does not exists'
				}));
			}
		},
		establish: function(connection) {
			var client = connection.client;
			ws.send( JSON.stringify({ type: 'connected', key: connection.key }) );

			client.on('msg', function(msg) {
				ws.send(JSON.stringify(
					_.defaults(msg, { key: connection.key })
					));
			});

			ws.on('message', function (msg) {
				var msgObj = JSON.parse(msg);
				if (msgObj.type == 'msg' && msgObj.key == connection.key) {
					client.emit('send', msgObj);
				}
			});

			ws.on('close', function() {
				client.removeAllListeners();
			});
		},
		disconnect: function(message) {
			console.log('Disconenct not implemented. Exiting');
			process.kill();
		}
	}	
};