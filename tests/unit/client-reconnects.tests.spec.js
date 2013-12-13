var modulePath = '../..'
	, config = require(modulePath + '/config')
	, client = require(modulePath + '/modules/client')
	, _ = require('underscore');

describe('client', function() {

	var cli, ws, ws_send, ws_listen, _callback;
	beforeEach(function() {
		
		ws = {
			send: function(message) {
				ws_send(message);
			},
			listen: function(message) {
				ws_listen(message);
			}
		}

		var proxy = function(connConf) {
			return {
				send: function(message) {
					ws.listen(message);				
				},
				connect: function() {
					return this;
				},
				listen: function(callback) {
					_callback = callback;
				},
				__id: 'for-testing'
			};
		}
		cli = client.init(proxy);	

		
	});

	it('should not fail when proxy disconnects', function() {
		ws_listen = function(callback) {
			console.log(callback);
		};
		ws_send = function(message) {
			throw Error("not opened");
		};
		cli.proxyWebClient('test', '1337-hash', ws);
		_callback("heyhey");
	});

});