var IRCProxy = require('./irc-proxy-client')
	, proxyFactory = require('./proxy-controller')
	, irc = require('irc')
	, _ = require('underscore')
	, auth = require('./auth');


var proxy = proxyFactory.createProxyController(IRCProxy.proxy);
var _runningClients = {};

var getRunningClients = function(id) {
	if (!_.has(_runningClients)) {
		_runningClients['test'] = [
			proxy.createProxy({server: 'irc.freenode.net', nick: 'pekka---', channels: ['#pekkabot'] }).connect()
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
	client.listen(function(message) {
		console.log(message.from, message.to, message.message);
		ws.send(JSON.stringify({
			from: message.from,
			to: message.to,
			message: message.message
		}));
	});
};
