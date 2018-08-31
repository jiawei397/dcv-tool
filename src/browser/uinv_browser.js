/* eslint-disable no-caller */
/**
 * 这是一个为所有模块引用前的基类，提供几个基础方法
 * 只能在浏览器使用
 * 发布模式下，会在这个文件之前添加一个变量uinv.isDist = true
 * @author jw
 * @date 2018-07-05
 */
var uinv = {};
// util对象
uinv.util = uinv.util || {};
// debug对象
uinv.debug = uinv.debug || {};
// error对象
uinv.error = uinv.error || {};

uinv.importJs = function (path) {
  document.write("<script type='text/javascript' src='" + path + "'></script>");
};

uinv.importCss = function (path) {
  document.write("<link rel='STYLESHEET' type='text/css' href='" + path + "'>");
};

/**
 * 判断是否谷歌浏览器
 * @author jw
 * @date 2018-05-22
 */
uinv.util.isChrome = function () {
  return /chrome/.test(navigator.userAgent.toLowerCase());
};

/**
 * 判断是否IE浏览器
 * @author jw
 * @date 2018-05-22
 */
uinv.util.isIE = function () {
  return (/msie/i.test(navigator.userAgent.toLowerCase()) || /Trident/i.test(navigator.userAgent.toLowerCase())) && !/opera/.test(navigator.userAgent.toLowerCase());
};

/**
 * 取url中某个参数
 * @param {String} name 参数名称
 */
uinv.util.urlArg = function (name) {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
  var r = window.location.search.substr(1).match(reg);
  if (r != null) {
    return unescape(r[2]);
  }
  return null;
};

// debug
uinv.debug.state = !!uinv.util.urlArg('debug');// debug状态
uinv.debug.list = [];
uinv.debug.add = function (msg) {
  uinv.debug.list.push(msg + '(MS:' + new Date().getTime() + ')');
};
uinv.debug.show = function (debug) {
  if (uinv.debug.state) {
    if (debug) {
      alert(debug + '(MS:' + new Date().getTime() + ')');
    } else if (uinv.debug.list.length > 0) {
      var show = '[debug]\r\n';
      for (var i in uinv.debug.list) {
        show += uinv.debug.list[i] + '\r\n';
      }
      alert(show);
    }
  }
};

// error
uinv.error.handle = function (e) {
  if (!uinv.util.isIE()) {
    alert('name: ' + e.name + '\r\nmessage: ' + e.message + '\r\nlineNumber: ' + e.lineNumber + '\r\nfileName: ' + e.fileName + '\r\nstack: ' + e.stack);
  } else {
    alert('name: ' + e.name + '\r\nerrorNumber: ' + (e.number & 0xFFFF) + '\r\nmessage: ' + e.message);
  }
};
uinv.error.list = [];
uinv.error.add = function (msg) {
  uinv.error.list.push(msg);
};
uinv.error.show = function (error) {
  if (error) {
    alert(error);
  } else if (uinv.error.list.length > 0) {
    var show = '[error]\r\n';
    for (var i in uinv.error.list) {
      show += uinv.error.list[i] + '\r\n';
    }
    alert(show);
  }
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
 * 封装的localStorage和sessionStorage方法
 * @private
 * @author jw
 * @date 2017-08-02
 */
uinv.util.data = function (storage, key, value) {
  if (key === undefined) {
    return null;
  }
  if (value === undefined) {
    return uinv.jsonParse(storage.getItem(key));
  } else if (value == null) {
    storage.removeItem(key);
  } else {
    storage.setItem(key, uinv.stringify(value));
  }
  return uinv;
};

/**
 * 封装localStorage方法
 */
uinv.data = function (key, value) {
  return uinv.util.data(localStorage, key, value);
};

/**
 * 封装sessionStorage方法
 */
uinv.sessionStorage = function (key, value) {
  return uinv.util.data(sessionStorage, key, value);
};

/**
 * 封装cookie方法
 */
uinv.cookie = function (key, value) {
  if (key === undefined) {
    return null;
  }
  if (value === undefined) {
    return uinv.jsonParse(uinv.util.getCookie(key));
  } else if (value == null) {
    uinv.util.delCookie(key);
  } else {
    uinv.util.setCookie(key, uinv.stringify(value));
  }
  return uinv;
};

/**
 * 设置cookie
 * @author jw
 * @date 2017-09-27
 */
uinv.util.setCookie = function (name, value, days) {
  if (days == null || days == '') {
    days = 300;
  }
  var exp = new Date();
  exp.setTime(exp.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = name + '=' + escape(value) + '; path=/;expires=' + exp.toGMTString();
};

/**
 * 获取cookie
 * @author jw
 * @date 2017-09-27
 */
uinv.util.getCookie = function (name) {
  var reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)'), arr = document.cookie.match(reg);
  if (arr) {
    return unescape(arr[2]);
  }
  return null;
};

/**
 * 获取所有cookie
 * @author jw
 * @date 2017-09-27
 */
uinv.util.getAllCookie = function () {
  return document.cookie;
};

/**
 * 删除cookie
 * @author jw
 * @date 2017-09-27
 */
uinv.util.delCookie = function (name) {
  var cval = this.getCookie(name);
  if (cval != null) {
    this.setCookie(name, '', -1);
  }
};

/**
 * 得到当前工程名称
 * @author jw
 * @date 2017-06-13
 */
uinv.util.getProjectName = function () {
  var project = window.location.pathname;
  if (project.indexOf('/', 1) == -1) {
    return '';
  }
  return project.substring(1, project.indexOf('/', 1));
};

/**
 * 获取当前ip和端口号
 * @author jw
 * @returns {String}
 */
uinv.util.getIp = function () {
  if (window.location.host != '') {
    return window.location.protocol + '//' + window.location.host;
  }
  uinv.debug.show('[提示]\r\n访问最好为网络模式.');
  return '';
};

/**
 * 判断当前浏览器是否64位
 * @author jw
 * @date 2016-11-19
 */
uinv.util.is64 = function () {
  return /win64/i.test(navigator.userAgent) && /x64/i.test(navigator.userAgent);
};

/**
 * 获得url后面的参数
 * @param {String} paramName
 * @param {HTMLElement} win 窗口
 * @return {Object} 参数的属性
 * @example uinv.util.getURLParams("ID");
 */
uinv.util.getURLParams = function (paramName, win) {
  return this.getURLParamsMap(win)[paramName];
};

/**
 * 读取到url的参数，放到Map里
 */
uinv.util.getURLParamsMap = function (win) {
  if (!win) {
    win = window;
  }
  var name, value, num;
  var str = win.location.search.substr(1);
  var arr = str.split('&'); // 各个参数放到数组里
  var params = {};
  for (var i = 0; i < arr.length; i++) {
    num = arr[i].indexOf('=');
    if (num > 0) {
      name = arr[i].substring(0, num);
      value = arr[i].substr(num + 1);
      params[name] = value;
    }
  }
  return params;
};

/**
 * 增加一个参数到Url中
 * @author jw
 * @date 2017-05-25
 */
uinv.util.addParam2Url = function (url, key, value) {
  var andStr = '?';
  var beforeparam = url.indexOf('?');
  if (beforeparam != -1) {
    andStr = '&';
  }
  return url + andStr + key + '=' + encodeURIComponent(value);
};

/**
 * 移出一个url参数
 * @author jw
 * @date 2017-05-25
 */
uinv.util.removeParamFromUrl = function (url, key) {
  if (url.indexOf(key) == -1) {
    return url;
  }
  var urlParam = url.substr(url.indexOf('?') + 1);
  var beforeUrl = url.substr(0, url.indexOf('?'));
  var nextUrl = '';

  var arr = [];
  if (urlParam != '') {
    var urlParamArr = urlParam.split('&');
    for (var i = 0; i < urlParamArr.length; i++) {
      var paramArr = urlParamArr[i].split('=');
      if (paramArr[0] != key) {
        arr.push(urlParamArr[i]);
      }
    }
  }
  if (arr.length > 0) {
    nextUrl = '?' + arr.join('&');
  }
  url = beforeUrl + nextUrl;
  return url;
};

uinv.util.addUrlParam = function (url, key, value) {
  return url.indexOf('?') != -1 ? url + '&' + key + '=' + value : url + '?' + key + '=' + value;
};

/**
 * 动态加载js
 * @author jw
 * @date 2017-11-21
 */
uinv.util.loadScript = function (url, callback) {
  var script = document.createElement('script');
  script.type = 'text/javascript';
  if (uinv.isFunction(callback)) {
    if (script.readyState) {
      script.onreadystatechange = function () {
        if (script.readyState == 'loaded' || script.readyState == 'complete') {
          script.onreadystatechange = null;
          callback();
        }
      };
    } else {
      script.onload = function () {
        callback();
      };
    }
  }
  script.src = url;
  document.body.appendChild(script);
};

/**
 * 动态添加css
 * @param {string} cssPath 路径
 * @param {string} id
 * @param {string} className 类标签
 */
uinv.util.requireCss = function (cssPath, id, className) {
  var link = document.createElement('link');
  link.rel = 'stylesheet';
  link.type = 'text/css';
  if (id) {
    link.id = id;
  }
  if (className) {
    link.className = className;
  }
  link.href = cssPath;
  document.getElementsByTagName('head')[0].appendChild(link);

  // 以下是需要兼容ie8时使用
  // $("head").append("<link>");
  // $("head").children(":last").attr({
  //   rel: "stylesheet",
  //   type: "text/css",
  //   id: id,
  //   className: className,
  //   href: cssPath
  // });
};

/**
 * 设置地址栏图标
 */
uinv.util.setFavicon = function (url) {
  this.removeFavicon();
  var link = document.createElement('link');
  link.type = 'image/x-icon';
  link.rel = 'icon';
  link.href = url;
  document.getElementsByTagName('head')[0].appendChild(link);
  //if (window.console) console.log("Set FavIcon URL to " + getFavicon().href);
};

/**
 * 移除地址栏图标
 */
uinv.util.removeFavicon = function () {
  var links = document.getElementsByTagName('link');
  var head = document.getElementsByTagName('head')[0];
  for (var i = 0; i < links.length; i++) {
    if (links[i].getAttribute('rel') === 'icon') {
      head.removeChild(links[i]);
    }
  }
};

/**
 * 获取url的hash键值对
 * @author jw
 * @date 2017-10-17
 */
uinv.util.getHashMap = function () {
  var datas = window.location.hash.split('#')[1];
  var map = {};
  if (!datas) return map;
  if (!(datas instanceof Array)) datas = [datas];
  for (var i = 0; i < datas.length; i++) {
    var t = datas[i].split('=');
    map[t[0]] = decodeURIComponent(t[1]);
  }
  return map;
};

/**
 * 根据key，获取url的hash值
 * @author jw
 * @date 2017-10-17
 */
uinv.util.getHashByKey = function (key) {
  return this.getHashMap()[key];
};

/**
 * 获取浏览器缩放比例
 * @author jw
 * @date 2018-01-17
 */
uinv.util.detectZoom = function () {
  var ratio = 0,
    screen = window.screen,
    ua = navigator.userAgent.toLowerCase();

  if (window.devicePixelRatio !== undefined) {
    ratio = window.devicePixelRatio;
  } else if (~ua.indexOf('msie')) {
    if (screen.deviceXDPI && screen.logicalXDPI) {
      ratio = screen.deviceXDPI / screen.logicalXDPI;
    }
  } else if (window.outerWidth !== undefined && window.innerWidth !== undefined) {
    ratio = window.outerWidth / window.innerWidth;
  }
  return ratio;
};

/**
 * 合并后一数组到前一数组里
 * @param {Array} arr 旧数组
 * @param {Array} newArr 需要被合并的数组
 */
uinv.util.concatArr = function (arr, newArr) {
  arr.push.apply(arr, newArr);
};

/**
 * 判断文件是否存在
 * @author jw
 * @param {String} url 文件地址，类似：http://127.0.0.1:8080/mmdb-rsm-web/base/dcv/projects/snapshot/images/C741F748-91F0-0001-D524-68801CBF1107.jpg
 */
uinv.util.isFileExist = function (url) {
  var x = new ActiveXObject('Microsoft.XMLHTTP');
  x.open('HEAD', url, false);
  x.send();
  return x.status == 200;
};

module.exports = uinv;
