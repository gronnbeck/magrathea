var modulePath = '../..'
, config = require(modulePath + '/config')
, _ = require('underscore');

var group = function(pair) {
	return { name: pair[0], proxy: pair[1] }
};

_.chain(config.proxies).pairs().map(group).each(function(proxyDescription) {

	var connConfStub = {}
	, proxy = proxyDescription.proxy(connConfStub)
	, name = proxyDescription.name;

	describe(name + ' implements the right interface', function () {
		
		it ('should contain an ID', function () {
			expect(_.has(proxy, '__id')).toBe(true);
		});

		it ('should contain an string ID', function () {
			expect(typeof proxy.__id).toBe('string');
		});
		
		it('should contain the connect function', function() {
			expect(_.has(proxy, 'connect')).toBe(true);
			expect(typeof proxy.connect).toBe('function');
		});

		it('should contain the send function', function() {
			expect(_.has(proxy, 'send')).toBe(true);
			expect(typeof proxy.send).toBe('function');
		});

		it('should contain the listen function', function() {
			expect(_.has(proxy, 'listen')).toBe(true);
			expect(typeof proxy.listen).toBe('function');
		});

	});	
})
