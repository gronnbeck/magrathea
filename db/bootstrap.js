var Q = require('q')

var config = {
  url: 'http://127.0.0.1:5984'
}
, nano = require('nano')(config)
, createdb = function(name) {
  var deferred = Q.defer()
  nano.db.create(name, function(err, body) {
    if (err) {
      deferred.reject(new Error('Database {name} already exists'
        .replace('{name}', name)))
    } else {
      deferred.resolve('Database {name} created'.replace('{name}', name))
    }
  })
  return deferred.promise
}

createdb('channel')
