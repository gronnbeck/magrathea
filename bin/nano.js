#!/usr/local/bin/node

var Save = require('../modules/save')
, save = Save.init()


save.createdb('channel')
.then(function(m) {
   console.log(m)
 }, function(error) {
   console.log('Database is already created')
 })
