var _ = require('underscore')

function Channel(obj) {
  this.network = obj.network
  this.channel = obj.channel
  this.log = obj.log
  return this
}

Channel.prototype.merge = function(chan, message) {
  if (_.isEmpty(chan.log)) {
    return _.extend(chan, { log: [message] })
  } else {
    return _.extend(chan, { log: _.flatten([ chan.log, message ])})
  }
}

exports.Channel = Channel
