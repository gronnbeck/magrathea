var WebSocket = require('ws');
var ws = new WebSocket('ws://localhost:1881');

ws.on('open', function() {

});

ws.on('message', function(data, flags) {
	var message = 'empty';
	console.log('sending message');
    ws.send(JSON.stringify(message))
});