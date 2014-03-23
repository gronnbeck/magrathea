var db = require('../modules/db.js').init()

exports.channel = function(network, channel) {
  return {
    get: function() {
      return db.channel()
      .then(function(init) {
        return init(network, channel)
      }).then(function(api) {
        return api.get()
      })
    }
  }
}
