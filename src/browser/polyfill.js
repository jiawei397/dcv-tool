/**
 * 增加个document.ready方法，类似jquery的
 */
(function () {
  var ie = !!(window.attachEvent && !window.opera);
  var wk = /webkit\/(\d+)/i.test(navigator.userAgent) && (RegExp.$1 < 525);
  var fn = [];
  var run = function () {
    for (var i = 0; i < fn.length; i++) fn[i]();
  };
  var d = document;
  d.ready = function (f) {
    if (!ie && !wk && d.addEventListener) {
      return d.addEventListener('DOMContentLoaded', f, false);
    }
    if (fn.push(f) > 1) return;
    if (ie) {
      (function () {
        try {
          d.documentElement.doScroll('left');
          run();
        } catch (err) {
          setTimeout(arguments.callee, 0);
        }
      })();
    } else if (wk) {
      var t = setInterval(function () {
        if (/^(loaded|complete)$/.test(d.readyState)) {
          window.clearInterval(t);
          run();
        }
      }, 0);
    }
  };
})();

/**
 * 处理console.log兼容性
 */
(function () {
  if (typeof console === 'undefined' || typeof console.log === 'undefined' || typeof console.time === 'undefined') {
    var names = ['log', 'debug', 'info', 'warn', 'error', 'assert', 'dir', 'dirxml',
      'group', 'groupEnd', 'time', 'timeEnd', 'count', 'trace', 'profile', 'profileEnd'];

    window.console = {};
    for (var i = 0; i < names.length; ++i) {
      window.console[names[i]] = uinv.noop;
    }
  }
})();

//jw 2017.11.06 兼容window.requestAnimationFrame
(function () {
  var lastTime = 0;
  var vendors = ['webkit', 'moz'];
  for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
    window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
  }

  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = function (callback) {
      var currTime = new Date().getTime();
      var timeToCall = Math.max(0, 16 - (currTime - lastTime));
      var id = window.setTimeout(function () {
          callback(currTime + timeToCall);
        },
        timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };
  }

  if (!window.cancelAnimationFrame) {
    window.cancelAnimationFrame = function (id) {
      clearTimeout(id);
    };
  }
})();
