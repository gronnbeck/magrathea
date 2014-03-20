var irc = require('irc')
, _ = require('underscore')
, events = require('events');

exports.init = function(config) {
	var emitter = new events.EventEmitter()
	, _client = new irc.Client(
		config.server,
		config.nick,
		{ channels: config.channels });

	_client.addListener('message', function (from, to, msg) {
		emitter.emit('msg', {
			type: 'msg',
			from: from,
			to: to,
			payload: msg,
			server: config.server,
			ts: new Date()
		});
	});

	emitter.on('send', function(message) {
		if (_.isEmpty(_client.chans)) {
			console.log('User is not connected');
			return;
		}
		if (message.type == 'msg') {
			_client.say(message.to, message.payload)
		} else if (message.type == 'raw') {
			_client.send(message.cmd);
		} else {
			console.log('InvalidMessageType: ' + message);
		}
	});

	return emitter;
};
