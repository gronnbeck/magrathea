#!/usr/local/bin/node

var Save = require('../modules/save')
, save = Save.init()


save.getdb('channel')
.then(function success(db) {
   return db
 }, function error(error) {
   console.log('Error: ' + error)
 })
 .then(function success(db) {
   return db.channel('freeonode', 'pokemen')
 }, function error(error) {
   console.log('Error: ' + error)
 })
 .then(function success(channel) {
   return channel.insert({ts: new Date(), from: 'me', payload: 'paaayload'})
 }, function error(error) {
   console.log(error)
 })
 .then(function success(inserted) {
   console.log('im done: ' + JSON.stringify(inserted))
 }, function (error) {
   console.log(error)
 })
 .catch(function(error) {
   console.log('what?: ' + error)
 })
