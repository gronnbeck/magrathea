WebSocket = require 'ws'
Queue = require './queue'
Db = require '../db'
_ = require 'underscore'

exports.start = (handlers) ->
  handlers = _.defaults(handlers, {
    client: () ->
      return 0
    server: () ->
      return 0
    })

  config = {
    server: {
      port: 8081
    },
    proxy: {
      url: 'ws://localhost',
      port: 8080
    }
  }

  db = Db.init()
  server = new WebSocket.Server { port: config.server.port }
  server.on 'connection', (client) ->
    url = [config.proxy.url, config.proxy.port].join ':'
    queue = Queue.init()
    proxy = new WebSocket url
    network = 'freenode'

    proxy.on 'open', (data) ->
      console.log 'Proxy found host server at ' + url

      queue.consume (data) ->
        handlers.server()
        proxy.send data

      client.on 'close', () ->
        proxy.close

    proxy.on 'message', (data) ->
      handlers.client(data)
      client.send data

    proxy.on 'close', () ->
      console.log 'Proxy closed unexpectedly'

    client.on 'message', (data) ->
      queue.send data
