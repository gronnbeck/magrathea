var traceur = require('traceur');
traceur.require.makeDefault(function(filename) {
  return filename.indexOf('node_modules/magrathea/lib/') !== -1;
});

module.exports = require('./lib/magrathea')
