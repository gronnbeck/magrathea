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
    },
    insert: function (message) {
      console.log(message)
      console.log(network)
      return db.channel()
      .then(function(init) {
        return init(network, message.to.replace('#',''))
      })
      .then(function(channel) {
        return channel.insert(message)
      })
    }
  }
}
