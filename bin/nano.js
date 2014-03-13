#!/usr/local/bin/node

var Save = require('../modules/save')
, save = Save.init()
, Q = require('q')
, dbName = 'channel'

var doIt = function() {
  save.getdb(dbName)
   .then(function success(db) {
     return db
   })
   .then(function success(db) {
     return db.channel('freenode', 'pokemen')
   })
   .then(function success(channel) {
     return channel.insert({from: 'me', ts: new Date(), payload: 'Hello'})
       .then(function response (response) {
         return channel.get(response.id)
       })
   })
   .then(function (chan) {
     console.log(chan)
   })
   .catch(function(error) {
     console.log('what?: ' + error)
   })

}

save.createdb(dbName)
.then(function() {
  console.log('Did not exist. Creating db')
  doIt()
}, function() {
  console.log('Finding already existing db')
  doIt()
})
