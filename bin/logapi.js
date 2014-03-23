var express = require('express')
, db = require('../modules/db.js').init()
, app = express()

app.get('/:network/:channel', function (req, res) {
  var network = req.params.network
  , channel = req.params.channel

  db.channel()
  .then(function(init) {
    return init(network, channel)
  }).then(function(api) {
    return api.get()
  }).then(function(chan) {
    res.send(chan)
  })

});

var server = app.listen(3000, function() {
  console.log('Listening on port %d', server.address().port)
})
