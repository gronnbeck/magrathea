var hash = require('../config').hash;

exports.createProxyController = function(proxyClass) {

	var _connections = {};

	return {
		getConnection: function(id) {
			return _connections[id];
		},

		connectionExists: function(id) {
			
		},

		createProxy: function(connConf) {
			var connection = proxyClass(connConf);
			var id = this.proxyId(connConf);
			_connections[id] = connection;
			return connection;
		},

		proxyId: function(connConf) {
			var str = 'server: ' + connConf.server + ' nick: ' + connConf.nick; 
			return hash(str);
		}
	};
};
