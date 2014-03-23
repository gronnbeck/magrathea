var express = require('express')
, app = express()
, logapi = require('../modules/logapi')

app.use(express.bodyParser());

app.get('/:network/:channel', function (req, res) {
  var network = req.params.network
  , channel = req.params.channel
  , chanapi = logapi.channel(network, channel)

  chanapi.get()
  .then(function(chan) {
    res.send(chan)
  })

});

app.post('/channel', function (req, res) {
  // network is hardcoded. For this to be better, I need to change
  // the data model a bit
  var network = 'freenode'
  , channel = req.body.channel

  if (channel === undefined && network === undefined) {
    res.send({ error: 'channel or network name missing'})
  }

  var chanapi = logapi.channel(network, channel)
  chanapi.insert(req.body)
});

var server = app.listen(3000, function() {
  console.log('Listening on port %d', server.address().port)
})
