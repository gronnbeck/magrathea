
exports.proxies = {
	'IRCProxy': require('./modules/irc-proxy-client').proxy
};

var md5 = require('md5');

exports.hash = function(str) {
	return md5.digest_s(str);
};