var MiddlewareHandler = (middlewares, end) => {
  var index = 0;
  return function(req) {

    var res = { data: req.data, send: end }

    var next = function() {
      if (middlewares.length == index) {
        res.send(res.data)
        index = 0;
      }
      else {
        var middleware = middlewares[index];
        index = index + 1;
        middleware(req, res, next);
      }
    };

    next();
  };
}

module.exports = MiddlewareHandler;
