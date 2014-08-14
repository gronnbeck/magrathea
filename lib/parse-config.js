
var _ = require('underscore') 
 , parseConfig = function(argv) {

  var setter = function(item, val) {
    var obj = {}
    obj[item] = val
    return obj
  }

  var flag = function(item) {
    return setter(item, true)
  }

  var value = function(pair) {
    return setter(pair[0], pair[1])
  }

  var args = argv

  if (_.isEmpty(args)) return {}
  else {

    var parsed = _.map(args, function(item) {
      if (item.indexOf('=') == -1) {
          return flag(item)
      }
      else {
        var pair = item.split('=')
        return value(pair)
      }
    })

    var merged = _.reduce(parsed, function(memo, num) {
      return _.extend(memo, num)
    }, {})

    return merged
  }
}
exports.parse = parseConfig
