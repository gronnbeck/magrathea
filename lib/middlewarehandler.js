var MiddlewareHandler = (middlewares, end, respond) => {
  var index = 0;
  return function(req) {

    var result = { data: req.data, send: (result) => {
      index = 0
      end(result)
      }
    }

    var next = function() {
      if (middlewares.length == index) {
        result.send(result.data)
        index = 0;
      }
      else {
        var middleware = middlewares[index];
        index = index + 1;
        middleware(req, result, next, respond);
      }
    };

    next();
    index = 0;
  };
}

module.exports = MiddlewareHandler;
