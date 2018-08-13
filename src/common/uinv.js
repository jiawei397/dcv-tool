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
