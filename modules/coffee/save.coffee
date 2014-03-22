WebSocket = require 'ws'
Queue = require './queue'

config = {
  server: {
    port: 8081
  },
  proxy: {
    url: 'ws://localhost',
    port: 8080
  }
}

exports.start = start = () ->
  server = new WebSocket.Server { port: config.server.port }
  Db = require '../db'
  db = Db.init()
  server.on 'connection', (client) ->
    url = [config.proxy.url, config.proxy.port].join ':'
    queue = Queue.init()
    proxy = new WebSocket url
    network = 'freenode'

    proxy.on 'open', (data) ->
      console.log 'Proxy found host server at ' + url

      queue.consume (data) ->
        proxy.send data

      client.on 'close', () ->
        proxy.close

    proxy.on 'message', (data) ->
      console.log 'sending client data ' + data
      message = JSON.parse data
      if message.type == 'msg' and message.to.indexOf '#' > -1
        db.channel()
        .then (init) ->
          return init(network, message.to.replace('#',''))
        .then (channel) ->
          return channel.insert(message)
        .catch (error) ->
          console.log(error)

      client.send data

    proxy.on 'close', () ->
      console.log 'Proxy closed unexpectedly'

    client.on 'message', (data) ->
      queue.send data
