exports.createProxyController = function(proxyClass) {
	return {
		getConnection: function(id) {
			
		},

		connectionExists: function(id) {
			
		},

		createProxy: function(connConf) {
			console.log(proxyClass);
			return proxyClass(connConf);
		}
	};
};
