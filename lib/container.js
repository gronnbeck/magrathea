var client = require('../lib/irc-client')
, _ = require('underscore')
, uuid = require('node-uuid');

exports.Connection = function() {
	var connections = {};

	return {
		create: function(config) {
			var key = config.key || uuid.v4();
			var connection = { key: key, client: client.init(config) };
			connections[key] = connection;
			return connection;
		},
		get: function (key) {
			return connections[key];
		},
		has: function (key) {
			return _.has(connections, key);
		}
	}
}
