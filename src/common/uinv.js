/*
 * 支持.js .css 全路径非跨域(http)加载，相对项目根路径加载，文件可带版本
 */
if (typeof window === 'undefined') {
  if (typeof process === 'object' && typeof require === 'function' && typeof global === 'object') {
    window = global;
  } else {
    window = this;
  }
}
window.IS_SUPPORT_IE = true;//给base加的变量，表示支持IE

var uinv = window.uinv || {};
uinv.ObjectEventType = uinv.ObjectEventType || {};
// util对象
uinv.util = uinv.util || {};

/**
 * 判断当前是否处于node环境
 * @author jw
 * @date 2017-08-15
 */
uinv.isInNode = function () {
  return typeof t3djs !== 'undefined' && t3djs && t3djs.inNodeJS;
};

/**
 * 克隆对象
 * @param {Object} obj 克隆的对象
 * @param {Boolean} isDeep 是否深度克隆，默认否
 * @param {Function} endFun 停止克隆的条件语句
 * @return {Array}  克隆后的对象
 */
uinv.util.cloneObj = uinv.cloneObj = (function () {
  var clone = function (obj, isDeep, endFun) {
    if (!obj || typeof obj !== 'object' || uinv.hash.isEmpty(obj) || (uinv.isFunction(endFun) && endFun(obj))) {
      return obj;
    }
    var c = obj instanceof Array ? [] : {};
    for (var i in obj) {
      var prop = obj[i];
      if (isDeep && typeof prop == 'object') {
        if (prop instanceof Array) {
          c[i] = [];

          for (var j = 0; j < prop.length; j++) {
            if (typeof prop[j] != 'object') {
              c[i].push(prop[j]);
            } else {
              c[i].push(clone(prop[j], isDeep, endFun));
            }
          }
        } else {
          c[i] = clone(prop, isDeep, endFun);
        }
      } else {
        c[i] = prop;
      }
    }
    return c;
  };
  return clone;
})();

/**
 * 继承
 */
uinv.extend = function (subClass, superClass) {
  var F = function () {
  }, cloneFun = uinv.util.cloneObj || uinv.cloneObj;
  F.prototype = superClass.prototype;
  subClass.prototype = new F();
  subClass.prototype.constructor = subClass;
  subClass.superclass = superClass.prototype;
  if (superClass.prototype.constructor === Object.prototype.constructor) {
    superClass.prototype.constructor = superClass;
  }
  if (!subClass.prototype.__extendList) {
    subClass.prototype.__extendList = [];
  } else {
    subClass.prototype.__extendList = cloneFun(subClass.prototype.__extendList);
  }
  subClass.prototype.__extendList.push(superClass);
};

/*
 * 多重继承
 * 对于子类和父类重复的成员,会取子类的成员
 * 对于父类重复的成员,会取最后一个父类的成员
 * 如果使用 instanceof 会和第一个父类的成员匹配
 */
uinv.multiExtend = function (subClass, superClasses, repleceExistedMember) {
  if (repleceExistedMember === undefined) repleceExistedMember = true;
  uinv.extend(subClass, superClasses[0]);

  for (var i = 1; i < superClasses.length; i++) {
    var curSuperClass = superClasses[i];
    for (var cur in curSuperClass.prototype) {
      if (cur == 'constructor') continue;
      if (repleceExistedMember) {
        subClass.prototype[cur] = curSuperClass.prototype[cur];
      } else {
        if (subClass.prototype[cur] === undefined || subClass.prototype[cur] === null) {
          subClass.prototype[cur] = curSuperClass.prototype[cur];
        }
      }
    }
    subClass.prototype.__extendList.push(curSuperClass);
  }
};

uinv.instanceOf = uinv.isInstance = function (subClass, superClass) {
  if (subClass instanceof superClass) return true;

  if (subClass && subClass.__extendList) {
    if (uinv.util.findItemInArray(subClass.__extendList, superClass) != -1) return true;
  }

  return false;
};

uinv.namespace = {
  /**
   * @description 命名空间注册
   * @param {String} s 命名空间
   * @example namespace.reg("my.desk.note")
   * @return {Object} 命名的对象
   */
  reg: function (s) {
    var arr = s.split('.');
    var namespace = window;

    for (var i = 0, k = arr.length; i < k; i++) {
      if (typeof namespace[arr[i]] == 'undefined') {
        namespace[arr[i]] = {};
      }
      namespace = namespace[arr[i]];
    }
    return namespace;
  },

  /**
   * @description 命名空间删除
   * @param {String} s 命名空间
   * @example namespace.del("my.desk.note")
   */
  del: function (s) {
    var arr = s.split('.');
    var namespace = window;

    for (var i = 0, k = arr.length; i < k; i++) {
      if (typeof namespace[arr[i]] == 'undefined') {
        return;
      } else if (k == i + 1) {
        delete namespace[arr[i]];
        return;
      }
      namespace = namespace[arr[i]];
    }
  },

  /**
   * @description 命名空间定义检测
   * @param {String} s 命名空间
   * @example namespace.isDefined("my.desk.note")
   * @return {Boolean} true 已经定义 false 未定义
   */
  isDefined: function (s) {
    var arr = s.split('.');
    var namespace = window;

    for (var i = 0, k = arr.length; i < k; i++) {
      if (typeof namespace[arr[i]] == 'undefined') {
        return false;
      }

      namespace = namespace[arr[i]];
    }

    return true;
  }
};

/**
 * 一个空函数
 */
uinv.noop = function () {
};

/**
 * 计算表达式的值，替代eval函数
 * @author jw
 * @date 2017-05-22
 */
uinv.eval = function (data) {
  var Fn = Function; // 一个变量指向Function，防止有些前端编译工具报错
  return new Fn('return ' + data)();
};

/**
 * 将字符串转换为json对象
 */
uinv.jsonParse = function (s, reviver) {
  if (!s || !(typeof s === 'string')) {
    return s;
  }
  var json;
  try {
    json = JSON.parse(s, reviver);
  } catch (e) {
    try {
      json = uinv.eval('(' + s + ')');// 主要用来处理带function的字符串
    } catch (e2) {
      json = s;
    }
  }
  return json;
};

/**
 * 转换json对象为字符串
 * @author jw
 * @date 2017-05-18
 */
uinv.stringify = function (v, replacer, space) {
  if (!v || !(typeof v === 'object')) {
    return v;
  }
  return JSON.stringify(v, replacer, space);
};

/**
 * 安全的随机数
 * @author jw
 * @date 2017-06-01
 */
uinv.random = (function () {
  var seed = new Date().getTime();
  return function () {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / (233280.0);
  };
})();

/**
 * 判断是否函数
 */
uinv.isFunction = function (fn) {
  return Object.prototype.toString.call(fn) === '[object Function]';
};

/**
 * 判断是否对象
 */
uinv.isObject = function (obj) {
  return Object.prototype.toString.call(obj) === '[object Object]';
};

/**
 * 判断是否字符串
 */
uinv.isString = function (obj) {
  return Object.prototype.toString.call(obj) === '[object String]';
};

/**
 * 判断是否数字
 */
uinv.isNumber = function (obj) {
  return Object.prototype.toString.call(obj) === '[object Number]';
};

/**
 * 设置token
 * @author jw
 * @date 2018-01-06
 */
uinv.setToken = function (token) {
  uinv.token = token;
  if (!uinv.isInNode()) {
    uinv.cookie('token', token);
    uinv.sessionStorage('token', token);
  }
};

/**
 * 获取token
 * 有优先级
 */
uinv.getToken = function () {
  return uinv.util.getURLParams('token') || uinv.cookie('token') || uinv.sessionStorage('token');
};

// 组件
uinv.component = uinv.component || {};
uinv.component.set = function (name, obj) {
  if (uinv.component[name]) {
    uinv.util.alert('Fail:Component [' + name + '] exist');
  } else {
    uinv.component[name] = obj;
  }
};
var u = uinv.component;

// String 扩展原型方法
String.prototype.trim = function () {
  return this.replace(/^\s*|\s*$/g, '');
};
String.prototype.endsWith = function (k) {
  return this.substring(this.length - k.length) == k;
};
String.prototype.startsWith = function (k) {
  return this.substring(0, k.length) == k;
};
String.prototype.has = function (k) {
  return this.indexOf(k) != -1;
};
String.prototype.replaceAll = function (s1, s2) {
  var r = new RegExp(s1.replace(/([\(\)\[\]\{\}\^\$\+\-\*\?\.\"\'\|\/\\])/g,
    '\\$1'), 'ig');
  return this.replace(r, s2);
};

if (!String.prototype.includes) {
  String.prototype.includes = function (search, start) {
    if (typeof start !== 'number') {
      start = 0;
    }
    if (start + search.length > this.length) {
      return false;
    }
    return this.indexOf(search, start) !== -1;
  };
}

// https://tc39.github.io/ecma262/#sec-array.prototype.includes
if (!Array.prototype.includes) {
  Object.defineProperty(Array.prototype, 'includes', {
    value: function (searchElement, fromIndex) {
      if (this == null) {
        throw new TypeError('"this" is null or not defined');
      }

      // 1. Let O be ? ToObject(this value).
      var o = Object(this);

      // 2. Let len be ? ToLength(? Get(O, "length")).
      var len = o.length >>> 0;

      // 3. If len is 0, return false.
      if (len === 0) {
        return false;
      }

      // 4. Let n be ? ToInteger(fromIndex).
      //    (If fromIndex is undefined, this step produces the value 0.)
      var n = fromIndex | 0;

      // 5. If n ≥ 0, then
      //  a. Let k be n.
      // 6. Else n < 0,
      //  a. Let k be len + n.
      //  b. If k < 0, let k be 0.
      var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

      function sameValueZero (x, y) {
        return x === y || (typeof x === 'number' && typeof y === 'number' && isNaN(x) && isNaN(y));
      }

      // 7. Repeat, while k < len
      while (k < len) {
        // a. Let elementK be the result of ? Get(O, ! ToString(k)).
        // b. If SameValueZero(searchElement, elementK) is true, return true.
        if (sameValueZero(o[k], searchElement)) {
          return true;
        }
        // c. Increase k by 1.
        k++;
      }

      // 8. Return false
      return false;
    }
  });
}

/**
 * 重写Number的toFixed方法
 * @param d
 * @returns {string}
 * @author liufeng
 * @date 1018-02-01
 */
Number.prototype.toFixed = function (d) {
  var s = this + '';
  if (!d) d = 0;
  if (s.indexOf('.') == -1) s += '.';
  s += new Array(d + 1).join('0');
  if (new RegExp('^(-|\\+)?(\\d+(\\.\\d{0,' + (d + 1) + '})?)\\d*$').test(s)) {
    var s = '0' + RegExp.$2, pm = RegExp.$1, a = RegExp.$3.length, b = true;
    if (a == d + 2) {
      a = s.match(/\d/g);
      if (parseInt(a[a.length - 1]) > 4) {
        for (var i = a.length - 2; i >= 0; i--) {
          a[i] = parseInt(a[i]) + 1;
          if (a[i] == 10) {
            a[i] = 0;
            b = i != 1;
          } else break;
        }
      }
      s = a.join('').replace(new RegExp('(\\d+)(\\d{' + d + '})\\d$'), '$1.$2');
    }
    if (b) s = s.substr(1);
    return (pm + s).replace(/\.$/, '');
  }
  return this + '';
};

// 说明：JS时间Date格式化参数
// 参数：格式化字符串如：'yyyy-MM-dd HH:mm:ss'
// 结果：如2016-06-01 10:09:00
Date.prototype.format = function (fmt) {
  var o = {
    'M+': this.getMonth() + 1,
    'd+': this.getDate(),
    'H+': this.getHours(),
    'm+': this.getMinutes(),
    's+': this.getSeconds(),
    'q+': Math.floor((this.getMonth() + 3) / 3),
    'S': this.getMilliseconds()
  };
  var year = this.getFullYear();
  var yearstr = year + '';
  yearstr = yearstr.length >= 4 ? yearstr : '0000'.substr(0, 4 - yearstr.length) + yearstr;

  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (yearstr + '').substr(4 - RegExp.$1.length));
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
    }
  }
  return fmt;
};

if (!Object.values) {
  Object.values = function (obj) {
    if (obj !== Object(obj)) {
      throw new TypeError('Object.values called on a non-object');
    }
    var val = [], key;
    for (key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        val.push(obj[key]);
      }
    }
    return val;
  };
}

// js国际化
uinv.language = uinv.language || {};

uinv.language['_'] = function (key, arrs) {
  return uinv.language.get(key, arrs);
};

uinv.language.get = (function () {
  var fun = function (key, arrs) {
    if (typeof (key) != 'string') {
      return key;
    }
    var splite = '{n}';
    if (!key) {
      return '';
    }
    if (key.has(splite) && !arrs) {
      arrs = key.substring((key.indexOf(splite) + splite.length), key.length).replaceAll('\'', '"');//jw 2016.09.13 将单引号换成\"，不然jsonTo会为空
      key = key.substring(0, (key.indexOf(splite)));
      if (arrs.has(splite)) { //jw 2016.09.09 如果字符串中还带有{n}，比如saveTaskForStockAndRacking_0_error{n}[device_0_in_other_task{n}[test]]，则将后一个作为参数
        if (arrs.startsWith('[') && arrs.endsWith(']')) {
          arrs = arrs.substring(1, arrs.length - 1);//jw 2016.09.13 去除[]
        }
        return fun(key, fun(arrs));
      }
      arrs = uinv.jsonParse(arrs);
    }
    var msg = key;
    if (!uinv.language.resource) {
      uinv.language.resource = {};
    }
    if ((msg.startsWith('\'') && msg.endsWith('\'')) || (msg.startsWith('"') && msg.endsWith('"'))) {
      msg = msg.substring(1, msg.length - 1);//jw 2016.09.14 去除''
    }
    if (uinv.language.resource[msg]) {
      msg = uinv.language.resource[msg] + '';
    }
    if (arrs !== undefined) {
      var isTransfered = false;
      arrs = uinv.util.isArray(arrs) ? arrs : [arrs];
      for (var i = 0; i < arrs.length; i++) {
        if (msg.indexOf('{' + i + '}') != -1) {
          isTransfered = true;
        }
        msg = msg.replaceAll('{' + i + '}', arrs[i] != null ? arrs[i] : '');
      }
      if (!isTransfered) {
        return isTransfered;//表示未翻译
      }
    }
    msg = msg.replace(/\{\d+\}/g, '');
    return msg;
  };
  return fun;
})();

uinv.language.getKey = function (val) {
  if (typeof val != 'string') {
    return val;
  }
  var msg = val;
  if (uinv_language_key_resource[val]) {
    msg = uinv_language_key_resource[val] + '';
  }
  msg = msg.replace(/\{\d+\}/g, '');
  return msg;
};
u.set('le', uinv.language);

/////////////////////////////////////从下是浏览器和node互调方法//////////////////////////////////

/**
 * 跳转到登陆页面
 * @author jw
 * @date 2016-11-16
 */
uinv.toLogin = function (beforeUrl) {
  uinv.invokeMethodInBrowser('uinv.toLogin', beforeUrl, function (beforeUrl) {
    uinv.server.manager.admin.log('跳转登陆，这时的token=' + uinv.token);
    var cfg = uinv.server.manager.admin.getConfiguration();
    uinv.util.stopAjax();//跳转到登陆页时，就不允许ajax访问了
    if (!beforeUrl) {
      beforeUrl = encodeURIComponent(window.location.href);
    }
    // var beforeUrl = uinv.dcvApiIp + 'integration/page/jumpin/' + code;
    uinv.cookie('token', null).sessionStorage('token', null).data('userInfo', null).data('language_version', null);
    uinv.data(uinv.language.type, null);
    sessionStorage.clear();
    window.location = cfg.ssoServerRoot + '/user/oauth/logout?beforeUrl=' + beforeUrl;
  });
};

/**
 * 跳转到空白页
 * @author jw
 * @date 2017-07-15
 */
uinv.toBlank = function () {
  uinv.invokeMethodInBrowser('uinv.toBlank', function () {
    parent.location = uinv.basePath + 'blank.html';
  });
};

/**
 * 返回到进入home页面之前的页面
 */
uinv.goIndex = function () {
  uinv.invokeMethodInBrowser('uinv.goIndex', function (code) {
    if (uinv.data('homeBeforeUrl')) {
      if (uinv.util.isChrome()) {
        window.parent.location.href = uinv.data('homeBeforeUrl');
      } else {
        location.href = uinv.data('homeBeforeUrl');
      }
    }
  });
};

/**
 * 页面调用node中代码
 * 适用于该方法同时在node和浏览器端加载的情况，其中func为在node端运行的回调函数
 * @author jw
 * @date 2017-11-17
 */
uinv.invokeMethodInNode = function (path, param, func) {
  if (uinv.isFunction(param)) {
    func = param;
    param = undefined;
  } else if (param !== undefined && !Array.isArray(param)) {
    param = [param];
  }
  if (uinv.isUseNode && !uinv.isInNode()) { //使用node且在浏览器运行
    //在浏览器运行
    return uinv.invokeNode({
      path: path,
      param: param
    });
  }
  //以下是在node端
  var result = func.apply(null, param);//有异常不再捕获
  if (!uinv.isUseNode) { //不使用node的话，需要返回成proimise，统一格式
    return Promise.resolve(result);
  }
  // if (uinv.isInNode()) { //用node的话，直接返回结果。因为包装成promise的话，返回结果太慢了
  return result;
  // }
};

/**
 * node调用页面中代码
 * 适用于该方法同时在node和浏览器端加载的情况，其中func为在页面端运行的回调函数
 * @author jw
 * @date 2017-11-17
 */
uinv.invokeMethodInBrowser = function (path, param, func) {
  if (uinv.isFunction(param)) {
    func = param;
    param = undefined;
  } else if (param !== undefined && !Array.isArray(param)) {
    param = [param];
  }
  if (uinv.isUseNode && uinv.isInNode()) { //在node端
    return uinv.invokeBrowser({
      path: path,
      param: param
    });
  }
  //以下是在浏览器端
  var result = func.apply(null, param);
  if (uinv.isUseNode) { //使用node的情况下，就不包装结果了
    return result;
  }
  //不使用node
  return Promise.resolve(result);
};

/**
 * 用bluebird实现Q的接口
 * @author jw
 * @date 2017-12-06
 */
var Q = {};
(function (Q) {
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
})(Q);

uinv.ajaxCacheCfg = {
  // isLog: false,//是否打印日志，默认打印
  // forceRefresh: true, //这个参数在具体被缓存的ajax请求中，可用来强制刷新
  // 业务逻辑判断请求是否缓存， res为ajax返回结果, options 为 $.ajax 的参数
  cacheValidate: function (res, options) { //选填，配置全局的验证是否需要进行缓存的方法,“全局配置” 和 ”自定义“，至少有一处实现cacheValidate方法
    if (res) {
      res = uinv.jsonParse(res);
      if (res && res.success) {
        // if(!res.data || ((res.data instanceof Array) && res.data.length == 0)){//返回数据为0
        //   return false;
        // }
        return true;
      }
    }
    return false;
  },
  // storageType: 'sessionStorage', //选填，‘localStorage’ or 'sessionStorage', 默认‘localStorage’
  timeout: 60 * 60 * 60, //选填， 单位秒。默认1小时
  session: {//选用sessionStorage存储
    storageType: 'sessionStorage',
    timeout: 60//选填， 单位秒
  }
};
// uinv.ajaxCache = true;
