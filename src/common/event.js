/**
 * 事件处理器，现在统一用config_tools.js
 * @author jw
 * @date 2017-08-17
 */
var EventEmitter = function () {
  this._listener = {};
};
EventEmitter.prototype.reg = function (type, fn) {
  if (type instanceof Array) {
    type = type[0];
  }
  if (typeof fn === 'function') {
    if (typeof this._listener[type] === 'undefined') {
      this._listener[type] = [fn];
    } else {
      this._listener[type].push(fn);
    }
  }
  return this;
};
EventEmitter.prototype.emit = function (type) {
  if (type && this._listener[type]) {
    var events = {
      type: type,
      target: this
    };
    for (var length = this._listener[type].length, start = 0; start < length; start += 1) {
      this._listener[type][start].call(this, events);
    }
  }
  return this;
};
EventEmitter.prototype.un = function (type, key) {
  var listeners = this._listener[type];
  if (listeners instanceof Array) {
    if (typeof key === 'function') {
      for (var i = 0, length = listeners.length; i < length; i += 1) {
        if (listeners[i] === key) {
          listeners.splice(i, 1);
          break;
        }
      }
    } else if (key instanceof Array) {
      for (var lis = 0, lenkey = key.length; lis < lenkey; lis += 1) {
        this.un(type, key[lenkey]);
      }
    } else {
      delete this._listener[type];
    }
  }
  return this;
};
var eventEmitter = new EventEmitter();

export default eventEmitter;
