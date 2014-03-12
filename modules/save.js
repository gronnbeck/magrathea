var Nano = require('nano')
, Q = require('q')
, _ = require('underscore')


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
    }

  }
}
