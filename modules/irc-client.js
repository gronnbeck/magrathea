var irc = require('irc')
, _ = require('underscore');

exports.client = function(connConf) {

	var _client;
	var connect = function() {	
		_client = new irc.Client(
			connConf.server, 
			connConf.nick, 
			{ channels: connConf.channels });
		return this;
	};

	var send = function(message) {
		// xxx hack to check if client has connceted yet
		if (_.isEmpty(_client.chans)) {
			console.log('User is not connected');
			return;
		}
		if (message.type == 'msg') {
			_client.say(message.to, message.msg)
		} else if (message.type == 'raw') {
			_client.send(message.cmd);	
		} else {
			throw 'InvalidMessageType';
		}
	};

	var listen = function(message_callback) {
		_client.addListener('message', function (from, to, msg) {
			message_callback({from: from, to: to, message: msg})
		});
	};

	return {
		send: send,
		connect: connect,
		listen: listen,
		__id: 'IRCProxy'
	}

};

