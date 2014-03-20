exports.init = init = () ->
  events = require 'events'
  _ = require 'underscore'
  emitter = new events.EventEmitter()
  queue = []

  resetQueue = () ->
    queue = []

  allElements = () ->
    return queue

  actions =
    listeners: () ->
      return events.EventEmitter.listenerCount(emitter, 'message')
    noListeners: () ->
      return this.listeners() <= 0
    consumeAll: () ->
      _.each allElements(), (data) ->
          emitter.emit('message', data)
          resetQueue()
    send: (data) ->
      if this.noListeners()
        queue.push(data)
      else
        this.consumeAll()
        emitter.emit('message', data)
    consume: (consumer) ->
      emitter.addListener('message', consumer)
      this.consumeAll()

  return actions
