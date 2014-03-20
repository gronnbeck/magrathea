WebSocket = require 'ws'
Queue = require '../modules/coffee/queue'

config = {
  server: {
    port: 8081
  },
  proxy: {
    url: 'ws://localhost',
    port: 8080
  }
}

# Problems:
# If the client sends a messages before proxys
# connection has been established. This proxy
# fails. We need to somehow batch up messages
# received before the proxy connection is complete
# or not send a "connection complete" before setup
# is complete


server = new WebSocket.Server { port: config.server.port }

server.on 'connection', (client) ->
  url = [config.proxy.url, config.proxy.port].join ':'
  queue = Queue.init()
  proxy = new WebSocket url

  proxy.on 'open', (data) ->
    console.log 'Proxy found host server at ' + url

    queue.consume (data) ->
      proxy.send data

    client.on 'close', () ->
      proxy.close

  proxy.on 'message', (data) ->
    console.log 'sending client data ' + data
    client.send data

  proxy.on 'close', () ->
    console.log 'Proxy closed unexpectedly'

  client.on 'message', (data) ->
    queue.send data
