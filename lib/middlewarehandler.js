var MiddlewareHandler = (middlewares, end) => {
  var index = 0;
  return function(data) {
    var req = data, res = data;

    var next = function() {
      if (middlewares.length == index) {
        end(req,res);
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
