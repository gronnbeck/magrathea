var Nano = require('nano')
, Q = require('q')
, _ = require('underscore')
, uuid = require('node-uuid')

var saveChannel = function(network, chan, message) {
  return {
      network: network,
      channel: chan,
      from: message.from,
      ts: message.ts,
      payload: message.payload
  }
}

var channelModel = function(db, nano) {
  return function(network, chan) {
    var channel = nano.db.use(db)

    function insert(message, deferred) {
      channel.insert(saveChannel(network, chan, message)
      , uuid.v4()
      , function(err, body) {
          if (err) deferred.reject(new Error(err))
          else deferred.resolve(body)
      })
    }

    function latestId() {
      var deferred = Q.defer()
      channel.list({
        descending: true,
        limit: 1
      }, function(err, body) {
        deferred.resolve(_.first(body.rows))
      })
      return deferred.promise
    }

    var methods = {
      insert: function(message) {
        var deferred = Q.defer()
        insert(message, deferred)
        return deferred.promise
      },
      latest: function() {
        return latestId()
        .then(function(ref) {
          return methods.get(ref.id)
        })
        .then(function(chan) {
          return chan
        })
      },
      get: function(id) {
        var deferred = Q.defer()
        channel.get(id, function(err, body) {
          deferred.resolve(body)
        })
        return deferred.promise
      }
    }
    return methods
  }
}

exports.init = function(conf) {
  var defaults = { url: 'http://127.0.0.1:5984/' }
  , config = _.defaults(conf || {}, defaults)
  , nano = Nano(config)

  return {
    createdb: function(name) {
      var deferred = Q.defer()
      nano.db.create(name, function(err, body) {
        if (err) {
          deferred.reject(new Error('Database already exists'))
        } else {
          deferred.resolve('Database {name} created'.replace('{name}', name))
        }
      })
      return deferred.promise
    },
    getdb: function(name) {
      var deferred = Q.defer()
      nano.db.get(name, function(error, body) {
        if (error) deferred.reject(new Error(error))
        else deferred.resolve({
          channel: channelModel(name, nano)
        })
      })
      return deferred.promise
    },
  }
}
