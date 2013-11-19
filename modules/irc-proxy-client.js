var irc = require('irc');

function IRCProxy (connConf) {

	var _client;


	var connect = function() {
		_client = new irc.Client(
			connConf.server, 
			connConf.nick, 
			{
				channels: connConf.channels
			}
		);
		return _client;
	};

	var send = function(to, message) {
	};

	var listen = function() {
		_client.addListener('message', function (from, to, message) {
			console.log('[LEAN MEAN AND IMPROVED] ' + from + ' => ' + to + ': ' + message);
		});
	};

	return {
		send: send,
		connect: connect,
		listen: listen,
	}

};

exports.getConnection = function(id) {

};

exports.connectionExists = function(id) {

};

exports.createProxy = function(connConf) {
	return IRCProxy(connConf);
};



