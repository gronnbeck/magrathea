var express = require('express')
, app = express()
, logapi = require('../modules/logapi')

app.get('/:network/:channel', function (req, res) {
  var network = req.params.network
  , channel = req.params.channel
  , chanapi = logapi.channel(network, channel)

  chanapi.get()
  .then(function(chan) {
    res.send(chan)
  })

});

var server = app.listen(3000, function() {
  console.log('Listening on port %d', server.address().port)
})
