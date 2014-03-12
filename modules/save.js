var Nano = require('nano')
, Q = require('q')


exports.init = function() {
  var config = {
    url: 'http://127.0.0.1:5984/'
  }
  , nano = Nano(config)

  return {
    createdb: function() {
      var deferred = Q.defer()
      nano.db.create('channel', function(err, body) {
        if (err) {
          deferred.reject(new Error('Database already exists'))
        } else {
          deferred.resolve('Database channel created')
        }
      })
      return deferred.promise
    }
  }
}
