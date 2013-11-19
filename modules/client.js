var irc = require('irc')
, _ = require('underscore')
, auth = require('./auth');


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

var getInnerToken = function(id) {
	return 'test';
};

exports.proxyWebClient = function(id, secret, ws_client) {
	if ( !auth.perform( id, secret ) ) {
		console.log('Wrongly auth using ( ' + id + ', ' + secret + ' )');
		return;
	}
	var innerToken = getInnerToken( id );
	var clients = getRunningClients( innerToken );
	bindClients2WS(clients, ws_client);
};

var bindClients2WS = function(clients, ws) {
	_.each(clients, function(client) {
		bindClient2WS(client, ws);
	});
};

var bindClient2WS = function(client, ws) {
	client.addListener('message', function (from, to, message) {
		ws.send(JSON.stringify({
			from: from,
			to: to,
			message: message
		}));

		console.log(from + ' => ' + to + ': ' + message);
	});
};
