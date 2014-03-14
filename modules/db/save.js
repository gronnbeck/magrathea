var Nano = require('nano')
, Q = require('q')
, _ = require('underscore')
, api = require('./api')

exports.init = function(conf) {
  var defaults = { url: 'http://127.0.0.1:5984/' }
  , config = _.defaults(conf || {}, defaults)
  , nano = Nano(config)

  return {
    channel: function() {
      var db = 'channel'
      var deferred = Q.defer()
      nano.db.get(db, function(error, body) {
        if (error) deferred.reject(new Error(error))
        else deferred.resolve(api.channels(nano.db.use(db)))
      })
      return deferred.promise
    },
  }
}
