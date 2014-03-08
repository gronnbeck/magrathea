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
				ws.send(JSON.stringify(msg));
			});

			ws.on('message', function (msg) {
				var msgObj = JSON.parse(msg);
				if (msgObj.type == 'msg') {
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