var hash = require('../config').hash;

exports.createProxyController = function(proxyClass) {

	var _connections = {};
	var repository = {
		_connections: {},
		get: function(id) {
			return this._connections[id];
		},
		save: function(id, connection) {
			this._connections[id] = connection;
		}
	};

	proxyId =  function(connConf) {
		var str = 'server: ' + connConf.server + ' nick: ' + connConf.nick; 
		return hash(str);
	}

	return {
		getConnection: function(id) {
			return repository.get(id);
		},

		connectionExists: function(id) {
			
		},

		createProxy: function(connConf) {
			var connection = proxyClass(connConf);
			var id = this.proxyId(connConf);
			repository.save(id, connection);
			return connection;
		},

		proxyId: proxyId
	};
};
