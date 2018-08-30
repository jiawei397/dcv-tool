/**
 * 事件处理器，现在统一用config_tools.js
 * @deprecated
 * @author jw
 * @date 2017-08-17
 */
var events = require('events');
var util = require('util');

var EventEmitter = function () {
  events.EventEmitter.call(this);
};
util.inherits(EventEmitter, events.EventEmitter);

EventEmitter.prototype.reg = function () {
  if (Array.isArray(arguments[0])) {
    arguments[0] = arguments[0][0];
  }
  // console.log(Array.prototype.slice.call(arguments));
  this.on.apply(this, arguments);
};
EventEmitter.prototype.regOnce = function () {
  if (Array.isArray(arguments[0])) {
    arguments[0] = arguments[0][0];
  }
  this.once.apply(this, arguments);
};
var eventEmitter = new EventEmitter();
module.exports = eventEmitter;
