#!/usr/local/bin/node

var Save = require('../modules/db/save')
, save = Save.init()
, Q = require('q')
, dbName = 'channel'

var run = function() {
  save.channel()
   .then(function success(channel) {
     return channel('freenode', 'pokemen')
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
  run()
}, function() {
  run()
})
