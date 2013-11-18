var WebSocket = require('ws');
var ws = new WebSocket('ws://localhost:8080');
ws.on('open', function() {
    ws.send('something');
});
ws.on('message', function(data, flags) {
    console.log(data);
});