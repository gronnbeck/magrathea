var Nano = require('nano')
, Q = require('q')
, _ = require('underscore')
, uuid = require('node-uuid')

exports.init = function(conf) {
  var defaults = {
    url: 'http://127.0.0.1:5984/'
  }
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
        var channel = nano.db.use(name)

        if (error) deferred.reject(new Error(error))
        else deferred.resolve({

          channel: function(network, chan) {

            return {
              insert: function(message) {
                var deferred = Q.defer()

                channel.insert({
                    network: network,
                    channel: chan,
                    from: message.from,
                    ts: message.ts,
                    payload: message.payload
                }
                , uuid.v4()
                , function(err, body) {
                    if (err) deferred.reject(new Error(err))
                    else deferred.resolve(body)
                })

                return deferred.promise
              }
            }
          }
        })
      })
      return deferred.promise
    },
  }
}
