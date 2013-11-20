var modulePath = '../..'
	, proxyModule = require(modulePath + '/modules/proxy-controller')
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
		, stub = createProxyStub;

	beforeEach(function() {
		controller = proxyModule.createProxyController(stub);

	});

	it('should exist', function() {
		expect(controller).not.toBe(null);
	});

	it('should return an instance of stub on createProxy', function() {
		expect(controller.createProxy().__id).toBe("ProxyStub");
	});

});


