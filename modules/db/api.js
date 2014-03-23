var Q = require('q')
, _ = require('underscore')
, models = require('./models')
, Channel = models.Channel

exports.channels = function(channel) {
  return function(network, chan) {
    var id = network + "_" + chan

    function insert(chanObj) {
      var deferred = Q.defer()
      var obj = new Channel(chanObj)
      var update = _.extend(obj, { _rev: chanObj._rev })
      channel.insert(update
      , id
      , function(err, body) {
          if (err) deferred.reject(new Error(err))
          else deferred.resolve(body)
      })
      return deferred.promise
    }

    return {
      insert: function(message) {
        return this.get(id)
        .then(function(chan) {
            return Channel.prototype.merge(chan, message)
        })
        .then(function(chan) {
            return insert(chan)
        })
        .catch(function() {
          return insert({
            network: network,
            channel: chan,
            log: [message]
          })
        })
      },
      get: function() {
        var deferred = Q.defer()
        channel.get(id, function(err, body) {
          deferred.resolve(body)
        })
        return deferred.promise
      }
    }
  }
}
