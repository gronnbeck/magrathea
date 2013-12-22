var proxyFactory = require('./proxy-controller')
, _ = require('underscore')
, auth = require('./auth');


exports.init = function(proxyClient) {
	var proxyController = proxyFactory.createProxyController(proxyClient);
	var _runningClients = {};

	var getRunningClients = function(id) {
		if (!_.has(_runningClients, 'test')) {
			_runningClients['test'] = [
			proxyController.createProxy({server: 'irc.freenode.net', nick: 'pekka---', channels: ['#pekkabot'] }).connect()
			];
		}
		return _runningClients[id];
	};

	this.proxyWebClient = function(id, secret, ws_client) {
		if ( !auth.perform( id, secret ) ) {
			console.log('Wrongly auth using ( ' + id + ', ' + secret + ' )');
			return;
		}
		var clients = getRunningClients( id );
		bindClients(clients, ws_client);

	};

	var bindClients = function(clients, ws) {
		_.each(clients, function(client) {
			bindClient(client, ws);
		});
	};

	var bindClient = function(client, ws) {
		ws2proxy(client, ws);
		proxy2ws(client, ws);
	};

	var trySendWS = function(ws, message) {
		try {
			ws.send(JSON.stringify({
				from: message.from,
				to: message.to,
				message: message.message
			}));
		} catch(err) {
			console.log('websocket has disconnected', err);
		}
	};

	var ws2proxy = function(client, ws) {
		client.listen(function(message) {
			trySendWS(ws, message);
		});
	};

	var proxy2ws = function(client, ws) {
		ws.listen(function(messageStr) {
			// xxx must validate message
			var message = JSON.parse(messageStr);
			client.send( { type: message.type, to: message.to, msg: message.msg } );
		});
	};

	return this;
}