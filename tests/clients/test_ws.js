var WebSocket = require('ws');
var ws = new WebSocket('ws://localhost:1881');

ws.on('open', function() {

});

ws.on('message', function(data, flags) {
	var message = { type: 'msg', to: '#pekkabot', msg: 'Hello World' };
	console.log('sending: ' + JSON.stringify(message));
    ws.send(JSON.stringify(message))
});