/**
 * 用bluebird实现Q的接口
 * @author jw
 * @date 2017-12-06
 */
const Promise = require('bluebird');
const clone = require('clone');

var isFunction = function (fn) {
  return Object.prototype.toString.call(fn) === '[object Function]';
};

//增加一个停止链式的方法
var STOP_VALUE = {};//只要外界无法“===”这个对象就可以了
var STOPPER_PROMISE = Promise.resolve(STOP_VALUE);

Promise.prototype.__then__ = Promise.prototype.then;

Promise.stop = function () {
  return STOPPER_PROMISE;//不是每次返回一个新的Promise，可以节省内存
};

Promise.prototype.then = function (onResolved, onRejected) {
  return this.__then__(function (value) {
    return value === STOP_VALUE || (isFunction(onResolved) ? onResolved(value) : onResolved);
  }, onRejected);
};

var Q = clone(Promise);

Q.defer = function () {
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
Q.isPromise = function (promise) {
  return promise instanceof Promise;
};

export default Q;
