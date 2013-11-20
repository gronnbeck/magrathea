(function() {
	exports.init = function(ws) {
		ws.on('message', function(message) {
			if (typeof listenCallback == 'function') {
				listenCallback(message)
			}
		});

		var send = function(message) {
			if (typeof message == 'string') {
				ws.send(message);
			} else {
				ws.send(JSON.stringify(message));
			}
		};

		var listenCallback;
		var listen = function(callback) {
			listenCallback = callback;
		};

		return {
			send: send,
			listen: listen
		};
	};
}());