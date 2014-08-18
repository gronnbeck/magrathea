var _ = require('underscore')
, WebSocket = require('ws')
, defaultContainer = require('./container')
, Commands = require('./commands')
, MiddlewareHandler = require('./middlewarehandler')
, events = require('events')


var defaults = {
  port: 8080
};

var EventEmitterWrap = (middleware) => {
  var emitter = new events.EventEmitter()
  emitter.on('send', function(raw) {
    var req = {
      data: raw
    }
    middleware(req)
  })

  return {
    on: emitter.on,
    send: function(msg) {
      emitter.emit('send', msg)
    },    emit: emitter.emit
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

  var container = undefined
  var useContainer = (c) => {
    container = c
  }

  var listen = (configure) => {

    var config = _.defaults(configure || {}, defaults)
    , wss = new WebSocket.Server({ port: config.port })
    , connections = container || defaultContainer.Connection();

    console.log('Starting IRC proxy with the following config:');
    console.log(JSON.stringify(config, null, 4))

    wss.on('connection', (ws) => {

      var outHandler = MiddlewareHandler(outs, (result) => {
        ws.send(result);
      })

      var emitter = EventEmitterWrap(outHandler);
      var cmds = Commands.init(emitter, connections)

      var inHandler = MiddlewareHandler(ins, (message) => {
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
        var req = { data: JSON.parse(msg) }
        inHandler(req)
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
    useContainer: useContainer,
    listen: listen
  }
}
