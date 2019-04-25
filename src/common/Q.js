/**
 * 实现Q的接口
 */
Promise.defer = function () {
  var _resolve, _reject;
  var promise = new Promise(function (resolve, reject) {
    _resolve = resolve;
    _reject = reject;
  });
  return {
    resolve: _resolve,
    reject: _reject,
    promise: promise
  };
};
//只用来判断是否bluebird
Promise.isPromise = function (promise) {
  return promise instanceof Promise;
};

export default Promise;
