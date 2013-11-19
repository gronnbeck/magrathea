var irc = require('irc');

exports.proxy = function(connConf) {

	var _client;
	var connect = function() {	
		_client = new irc.Client(
			connConf.server, 
			connConf.nick, 
			{
				channels: connConf.channels
			}
			);
		return this;
	};

	var send = function(message) {
		_client.send(JSON.stringify(message));
	};

	var listen = function(message) {
		_client.addListener('message', function (from, to, msg) {
			message({from: from, to: to, message: msg})
		});
	};

	return {
		send: send,
		connect: connect,
		listen: listen,
	}

};





