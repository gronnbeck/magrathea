var getInnerClientToken = function(id, secret) {
	if (getSecretForId(id) == secret) {
		return getInnerToken(id);
	}
	return '';
};

var getSecretForId = function(id) {
	return '1337-hash';
};

exports.perform = function(id, secret) {
	if (getSecretForId(id) == secret) {
		return true;
	} 
	return false;
};

