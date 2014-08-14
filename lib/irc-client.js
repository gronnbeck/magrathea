var irc = require('irc')
, _ = require('underscore')
, events = require('events');

exports.init = function(config) {
	console.log('IRC client started with config:')
	console.log(JSON.stringify(config, null, 4))

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
			_client.send.apply(_client, message.cmd);
		} else {
			emitter.emit('msg', JSON.stringify({
					type: 'error',
					payload: 'InvalidMessageType: ' + message
			}));
		}
	});

	_client.addListener('raw', function(raw, raw2) {
		emitter.emit('raw', raw)
	})

	return emitter;
};
