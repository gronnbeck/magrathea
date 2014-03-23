proxy = require './ws2ws-proxy'
request = require 'request'

fromClient = (data) ->
  message = JSON.parse data
  if message.type == 'msg' and message.to.indexOf '#' > -1
    options =
      uri: 'http://localhost:3000/channel'
      method: 'post'
      json: message

    request options, (error, res, body) ->
      if error
        console.log error


exports.start = start = () ->
  handlers =
    client: fromClient

  proxy.start(handlers)
