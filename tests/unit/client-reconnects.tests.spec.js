var modulePath = '../..'
	, config = require(modulePath + '/config')
	, client = require(modulePath + '/client')
	, _ = require('underscore');

describe('client', function() {

	var cli, ws;
	beforeEach(function() {
		cli = client.init({
			send: function(message) {
				
			},
			connect: function() {

			},
			listen: function(callback) {

			},
			__id: 'for-testing'
		});	

		ws = {
			send: function(message) {

			},
			listen: function(message) {

			}
		}
	});

	it('should not fail when proxy disconnects', function() {

	});

	it('should not send message to a disconnected proxy', function() {

	})

});