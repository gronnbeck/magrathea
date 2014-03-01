var client = require('../modules/irc-client')
, _ = require('underscore')
, uuid = require('node-uuid');

exports.Connection = function() {
	var connections = {};

	return {
		create: function(config) {
			return { key: uuid.v4(), client: client.init(config) };
		},
		get: function (key) {
			return connections[key];
		},
		has: function (key) {
			return _.has(connections, key);
		},
		retreiveOrCreate: function(key, config) {
			if (this.has(key)) return this.get(key);
			else return this.create(config);
		}
	}
}