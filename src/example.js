(function (global, factory) {
  // CommonJS、CMD规范检查
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    // AMD规范检查
    typeof define === 'function' && define.amd ? define(factory) : (global.uinv = factory());
}(this, (function () {
  'use strict';
  // 你的代码
  return uinv;
} )))
