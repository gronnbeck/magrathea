var client = require('./modules/irc-client');

var conf = { server: 'irc.freenode.net', nick: 'tester-irc-proxy-', channels: ['#nplol', '#pekkabot'] };

client.client(conf).connect();
