var Nano = require('nano')
, Q = require('q')
, _ = require('underscore')
, uuid = require('node-uuid')

var saveChannel = function(network, chan, obj) {
  return {
      network: network,
      channel: chan,
      from: obj.from,
      ts: obj.ts,
      log: obj.log
  }
}

var channelModel = function(db, nano) {
  return function(network, chan) {
    var id = network + "_" + chan
    var channel = nano.db.use(db)

    function insert(chanObj) {
      var deferred = Q.defer()
      var update = _.extend(saveChannel(network, chan, chanObj), { _rev: chanObj._rev })
      channel.insert(update
      , id
      , function(err, body) {
          if (err) deferred.reject(new Error(err))
          else deferred.resolve(body)
      })
      return deferred.promise
    }

    var methods = {
      insert: function(message) {

        function merge(chan, message) {
            if (_.isEmpty(chan.log)) {
              return _.extend(chan, { log: [message] })
            } else {
              return _.extend(chan, { log: _.flatten([ chan.log, message ])})
            }

        }

        return methods.get(id)
        .then(function(chan) {
            return merge(chan, message)
        })
        .then(function(chan) {
            return insert(chan)
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
