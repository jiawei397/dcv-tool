/**
 * 用bluebird实现Q的接口
 * @author jw
 * @date 2017-12-06
 */
var Q = {};
(function (Q, Promise) {
  //增加一个停止链式的方法
  var STOP_VALUE = {};//只要外界无法“===”这个对象就可以了
  var STOPPER_PROMISE = Promise.resolve(STOP_VALUE);

  Promise.prototype.__then__ = Promise.prototype.then;

  Q.stop = Promise.stop = function () {
    return STOPPER_PROMISE;//不是每次返回一个新的Promise，可以节省内存
  };

  Promise.prototype.then = function (onResolved, onRejected) {
    return this.__then__(function (value) {
      return value === STOP_VALUE || (uinv.isFunction(onResolved) ? onResolved(value) : onResolved);
    }, onRejected);
  };

  Q.defer = function () {
    var resolve, reject;
    var promise = new Promise(function () {
      resolve = arguments[0];
      reject = arguments[1];
    });
    return {
      resolve: resolve,
      reject: reject,
      promise: promise
    };
  };
  Q.reject = Promise.reject;
  Q.resolve = Promise.resolve;
  Q.all = Promise.all;
  Q.each = Promise.each;
  Q.join = Promise.join;
  Q.isPromise = function (promise) {
    return promise instanceof Promise;
  };
})(Q, P);
