proxy = require './ws2ws-proxy'

fromClient = (data) ->
  message = JSON.parse data
  if message.type == 'msg' and message.to.indexOf '#' > -1
    db.channel()
    .then (init) ->
      return init(network, message.to.replace('#',''))
    .then (channel) ->
      return channel.insert(message)
    .catch (error) ->
      console.log(error)

exports.start = start = () ->
  handlers =
    client: fromClient

  proxy.start(handlers)
