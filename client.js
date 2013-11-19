var irc = require('irc')
	, _ = require('underscore');

exports.getInnerClientToken = function(id, secret) {
	if (getSecretForId(id) == secret) {
		return getInnerToken(id);
	}
	return '';
};

var getSecretForId = function(id) {
	return '1337-hash';
};

var getInnerToken = function(id) {
	return '1337-hash';
};


var _runningClients = {};

var getRunningClients = function(id) {
	if (!_.has(_runningClients)) {
		_runningClients['test'] = [
			new irc.Client('irc.freenode.net', 'pekka---', {
				channels: ['#pekkabot']
			})
		];
	}
	return _runningClients[id];
};

exports.proxyWebClient = function(ws_client) {
	var clients = getRunningClients('test');
	clients[0].addListener('message', function (from, to, message) {
		ws_client.send(JSON.stringify({
			from: from,
			to: to,
			message: message
		}));

		console.log(from + ' => ' + to + ': ' + message);
	});
};
