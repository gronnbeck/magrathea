#!/usr/local/bin/node

var Save = require('../modules/save')
, save = Save.init()


save.createdb()
.then(function(m) {
   console.log(m)
 }, function(error) {
   console.log(error)
 })
