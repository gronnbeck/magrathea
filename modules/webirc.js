var _ = require('underscore')
, WebSocket = require('ws')
, container = require('./container')
, Commands = require('./commands')
, events = require('events');

var defaults = {
  port: 8080
};

function EventEmitterWrap (middleware) {
  var emitter = new events.EventEmitter();
  emitter.on('send', function(data) {
    middleware(data)
  })
  return {
    on: emitter.on,
    send: function(msg) {
      emitter.emit('send', msg)
    },
    emit: emitter.emit
  }
}

function MiddlewareHandler(middlewares, end) {
  var index = 0;
  return function(data) {
    var req = data, res = data;

    var next = function() {
      if (middlewares.length == index) {
        end(req,res)
        index = 0;
      }
      else {
        var middleware = middlewares[index];
        index = index + 1;
        middleware(req, res, next);
      }
    }

    next();
  }

}

module.exports = function() {
  var middlewares = [];

  var use = function(middleware) {
    middlewares = _.flatten([middleware, middlewares])
  }

  var start = function(configure) {

    var config = _.defaults(configure || {}, defaults)
    , wss = new WebSocket.Server({ port: config.port })
    , connections = container.Connection();

    console.log('Starting IRC proxy with the following config:');
    console.log(JSON.stringify(config, null, 4))

    wss.on('connection', function (ws) {

      var middleHandler = MiddlewareHandler(middlewares, function(req,res) {
        ws.send(res);
      })

      var emitter = EventEmitterWrap(middleHandler);
      var cmds = Commands.init(emitter, connections);

      emitter.on('message', function(msg) {
        console.log('Received message: ' + msg)
        var message = JSON.parse(msg);

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

      console.log("WS Connection opened");
      ws.on('message', function (msg) {
        emitter.emit('message', msg)
      });
    });
  };

  return {
    use: use,
    start: start
  }
}
