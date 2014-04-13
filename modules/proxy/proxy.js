var _ = require('underscore')
, webSocket = require('ws')
, container = require('../container')
, Commands = require('./commands');

var defaults = {
	port: 8080
};

exports.start = function(configure) {

	var config = _.defaults(configure || {}, defaults)
	, wss = new webSocket.Server({ port: config.port })
	, connections = container.Connection();

	console.log('Starting IRC proxy with the following config:');
	console.log(JSON.stringify(configure, null, 4))

	wss.on('connection', function (ws) {
		var cmds = Commands.init(ws, connections);

		console.log("Connection received from " + ws);
		ws.on('message', function (msg) {
			var message = JSON.parse(msg);

			if (_.has(cmds, message.type))
				cmds[message.type](message);
			else {
				ws.send(JSON.stringify({
					success: false,
					type: 'unknown command',
					msg: message.type +'" command does not exist'
				}));
			}
		});
	});
};
