var _ = require('underscore')
, WebSocket = require('ws')
, container = require('./container')
, Commands = require('./commands')
, MiddlewareHandler = require('./middlewarehandler')
, events = require('events')


var defaults = {
  port: 8080
};

var EventEmitterWrap = (middleware) => {
  var emitter = new events.EventEmitter();
  emitter.on('send', function(data) {
    middleware.out(data)
  })

  return {
    on: emitter.on,
    send: function(msg) {
      emitter.emit('send', msg)
    },
    emit: emitter.emit
  }
};


module.exports = () => {

  var outs = [];
  var useOut = (middleware) => {
    outs = _.flatten([outs, middleware])
  }

  var ins = [];
  var useIn = (middleware) => {
    ins = _.flatten([ins, middleware])
  }

  var listen = (configure) => {

    var config = _.defaults(configure || {}, defaults)
    , wss = new WebSocket.Server({ port: config.port })
    , connections = container.Connection();

    console.log('Starting IRC proxy with the following config:');
    console.log(JSON.stringify(config, null, 4))

    wss.on('connection', (ws) => {

      var outHandler = MiddlewareHandler(outs, (req,res) => {
        ws.send(res);
      })

      var emitter = EventEmitterWrap({ out: outHandler });
      var cmds = Commands.init(emitter, connections);

      var inHandler = MiddlewareHandler(ins, (req, res) => {
        console.log('Received message: ' + req)
        var message = JSON.parse(req);
        if (_.has(cmds, message.type))
          cmds[message.type](message);
        else {
          emitter.send(JSON.stringify({
            success: false,
            type: 'unknown command',
            msg: message.type +'" command does not exist'
          }));
        }
      })


      emitter.on('message', (msg) => {
        inHandler(msg)
      })

      console.log("WS Connection opened");
      ws.on('message', (msg) => {
        emitter.emit('message', msg)
      });
    });
  };

  return {
    useIn: useIn,
    useOut: useOut,
    listen: listen
  }
}
