var modulePath = '../..'
	, proxyModule = require(modulePath + '/modules/proxy-controller')
	, config = require(modulePath + '/config')
	, _ = require('underscore');


var createProxyStub = function() {
	var _callback, _rec;
	return {
		__id: "ProxyStub",
		connect: function() {
			return this;
		},
		send: function(message) {
			_rec.get(message);
		},
		listen: function(callback) {
			_callback = callback;
		},
		_send2listen: function(msg) {
			_callback(msg);
		},
		_listen2send: function(rec) {
			_rec = rec;
		}
	}
}

describe('proxy controller', function() {
	
	var controller = null
		, stub = createProxyStub
		, connConfig = { server: 'just.a.server', nick: 'nick--' };

	beforeEach(function() {
		controller = proxyModule.createProxyController(stub);

	});

	it('should exist', function() {
		expect(controller).not.toBe(null);
	});

	it('should return an instance of stub on createProxy', function() {
		expect(controller.createProxy(connConfig).__id).toBe("ProxyStub");
	});

	it('should cache proxies on creation', function() {
		
		var id = controller.proxyId(connConfig);
		var proxy = controller.createProxy(connConfig);

		expect(controller.getConnection(id)).toBe(proxy);
	});

});


