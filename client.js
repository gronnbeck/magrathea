var irc = require('irc')
	, _ = require('underscore');


exports.proxyWebClient = function(ws_client) {
	var client = new irc.Client('irc.freenode.net', 'pekka---', {
		channels: ['#pekkabot']
	});

	client.addListener('message', function (from, to, message) {
		ws_client.send(JSON.stringify({
			from: from,
			to: to,
			message: message
		}));

		console.log(from + ' => ' + to + ': ' + message);
	});
};
