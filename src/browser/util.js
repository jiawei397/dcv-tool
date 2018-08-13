/* eslint-disable no-caller */
/**
 * 这是一个为所有模块引用前的基类，提供几个基础方法
 * 只能在浏览器使用
 * 发布模式下，会在这个文件之前添加一个变量uinv.isDist = true
 * @author jw
 * @date 2018-07-05
 */
var uinv = window.uinv || {};
// util对象
uinv.util = uinv.util || {};

uinv.ns = 'dcvWeb';//用个变量控制目前前端的名称空间

uinv.baseT3dArr = [];//存储base中t3d加载的数组，只有使用node时才有用

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
if (!String.prototype.startsWith) {
  String.prototype.startsWith = function (k) {
    return this.substring(0, k.length) == k;
  };
}

uinv.importJs = function (path) {
  document.write("<script type='text/javascript' src='" + path + "'></script>");
};

uinv.importCss = function (path) {
  document.write("<link rel='STYLESHEET' type='text/css' href='" + path + "'>");
};

uinv.util.urlArg = function (name) {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
  var r = window.location.search.substr(1).match(reg);
  if (r != null) {
    return unescape(r[2]);
  }
  return null;
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
 * 各个工程的基本命名空间，目前为ip + tarsier-vmdb/dcvWeb/
 * @returns {String}
 */
uinv.util.getRoot = function () {
  var ip = this.getIp();
  if (ip) {
    return ip + '/' + this.getProjectName() + '/' + uinv.ns + '/';
  }
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
 * 提供一个公用的判断是否使用node，不强制使用
 * @author jw
 * @date 2018-07-05
 */
uinv.util.isUseNode = function () {
  if (uinv.util.isChrome()) { //谷歌浏览器目前只能使用node
    return true;
  }
  return uinv.data('isUseNode') === true;
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
 * 解析fileList
 */
uinv.util.getFilesArrFunc = (function () {
  var flatten = function (arr) {
    return arr.reduce(function (a, b) {
      return a.concat(Array.isArray(b) ? flatten(b) : b);
    }, []);
  };

  /**
   * 约定好的key，提前需要定义在window下
   */
  var getKey = function (key) {
    return 'IS_LOAD_' + key.toUpperCase();
  };

  var concatArr = uinv.util.concatArr;

  var getFlattenArr = function (map) {
    return flatten(Object.values(map));
  };

  return function (filesMap, urlPrefix, nodeArr) {
    var isUseNode = uinv.isUseNode;
    var jsFilesArray = [];
    var cssArr = [];
    for (var key in filesMap.js) {
      if (key === 'common' || key === 'browser' || key === 'config' || window[getKey(key)]) {
        var map = filesMap.js[key];
        if (key.startsWith('t3d')) {
          var arr3 = getFlattenArr(map);
          if (isUseNode) {
            concatArr(uinv.baseT3dArr, arr3);
          }
          concatArr(jsFilesArray, arr3);
        } else if (key.startsWith('3d')) {
          for (var key2 in map) {
            var arr2 = getFlattenArr(map[key2]);
            if (isUseNode && key2.indexOf('node') !== -1) { //使用node时，把包括node的放个数组里，且不允许页面再加载
              concatArr(nodeArr, arr2);
              continue;
            }
            if (isUseNode && key2.indexOf('common') !== -1) {
              concatArr(nodeArr, arr2);
            }
            if (key2.indexOf('common') !== -1 || key2.indexOf('browser') !== -1 || window[getKey(key2)]) {
              concatArr(jsFilesArray, arr2);
            }
          }
        } else {
          var arr = getFlattenArr(map);
          concatArr(jsFilesArray, arr);
          if (isUseNode && (key === 'common' || key === 'config')) { //使用node时，common部分也要放nodeArr里
            concatArr(nodeArr, arr);
          }
        }
      }
    }
    for (var key in filesMap.css) {
      if (key === 'common' || window[getKey(key)]) {
        cssArr = cssArr.concat(flatten(Object.values(filesMap.css[key])));
      }
    }
    return [cssArr, jsFilesArray];
  };
})();

/**
 * 获取fileList的文件
 * @author jw
 * @date 2018-08-06
 */
uinv.util.getFileListMap = function (urlPrefix, fileListPath) {
  var key = urlPrefix + fileListPath;
  var filesMap = uinv.sessionStorage(key);
  if (filesMap && uinv.isDist) {
    return filesMap;
  }
  var httpRequestHandler = null;
  if (window.XMLHttpRequest) {
    httpRequestHandler = new XMLHttpRequest();
  } else if (window.ActiveXObject) {
    httpRequestHandler = new window.ActiveXObject();
  } else {
    throw new Error('未找到XMLHttpRequest或ActiveXObject对象');
  }
  httpRequestHandler.open('GET', urlPrefix + fileListPath, false);
  httpRequestHandler.send(null);
  var status = httpRequestHandler.status;
  if (httpRequestHandler.readyState === 4 && ((status >= 200 && status < 300) || status === 304)) {
    uinv.sessionStorage(key, httpRequestHandler.responseText);
    filesMap = JSON.parse(httpRequestHandler.responseText);
    return filesMap;
  }
};

/**
 * 加载资源
 * @param {String} urlPrefix 前面拼接的字符串
 * @param {Array} nodeArr 需要加载的数组，默认为空
 * @author jw
 * @date 2018-07-02
 */
uinv.loadResources = (function () {
  var browserLoadedArr = [];
  var nodeLoadedArr = [];

  var baseRoot = uinv.util.getRoot();

  //如果字符串是以/开头，则在基础目录上拼接base/dcv/giv/itv，此处不校验规则
  var preAddStr = function (str, urlPrefix) {
    if (str.startsWith('/')) {
      if (uinv.isDist) {
        return baseRoot + str.substr(1);
      }
      return str;
    }
    return urlPrefix + str;
  };

  return function (urlPrefix, nodeArr, fileListPath, getFilesArray) {
    if (!nodeArr) {
      nodeArr = [];
    }
    if (!urlPrefix) {
      throw new Error('urlPrefix cannot be empty!');
    }
    if (fileListPath === undefined) {
      fileListPath = 'file_list.json';
    }
    if (getFilesArray === undefined) {
      getFilesArray = function (filesMap, urlPrefix) {
        return uinv.util.getFilesArrFunc(filesMap, urlPrefix, nodeArr);
      };
    }
    var filesMap = uinv.util.getFileListMap(urlPrefix, fileListPath);
    var filesArr = getFilesArray(filesMap, urlPrefix);

    var cssArr = filesArr[0];
    cssArr = cssArr.map(function (item) {
      return '<link href="' + preAddStr(item, urlPrefix) + '" rel="stylesheet"/>';
    });

    var jsArr = filesArr[1];
    jsArr = jsArr.map(function (item) {
      return '<script src="' + preAddStr(item, urlPrefix) + '"></script>';
    });

    var newBrowArr = cssArr.concat(jsArr).filter(function (item) {
      if (browserLoadedArr.indexOf(item) === -1) {
        browserLoadedArr.push(item);
        return true;
      }
    });
    document.write(newBrowArr.join(''));

    //过滤掉重复的，一般只有加载其它模块时才会重复，暂时就不考虑跨域之类的情况
    nodeArr = nodeArr.filter(function (item) {
      if (nodeLoadedArr.indexOf(urlPrefix + item) === -1) {
        nodeLoadedArr.push(urlPrefix + item);
        return true;
      }
    });
    return nodeArr;
  };
})();

//定义几个全局变量，其实放这里不合适，但再起一个文件也不得于维护，因为它是暴露出来供其它模块引用的文件，各模块之间相互引用也要有规则
(function () {
  uinv.ip = uinv.util.getIp();
  uinv.baseRoot = uinv.util.getRoot();
  uinv.basePath = uinv.baseRoot + 'base/';
  uinv.dcvIpPath = uinv.baseRoot + 'dcv/';
  uinv.itvIpPath = uinv.baseRoot + 'itv/';
  uinv.givIpPath = uinv.baseRoot + 'giv/';
  uinv.fsmIpPath = uinv.baseRoot + 'fsm/';

  var defaultConfig = {
    IS_LOAD_LANGUAGE: true, //国际化，默认开启
    IS_TEST_INPUT_REPLACE: true, //校验输入框，默认开启
    IS_USE_NODE: false, //使用node
    IS_USE_WEBGL: false, //使用webgl
    IS_LOAD_3D: false,
    IS_REMOTE_RESOURCE: false, //是否获取远程资源路径
    IS_LOAD_3D_CONFIGURE: false, //是否读取可视化配置
    IS_LOAD_3D_U3D: false, //是否使用u3d
    IS_LOAD_UWEB_UTIL: false, //是否加载uweb工具方法
    IS_LOAD_UWEB_HOME: false,
    IS_LOAD_3D_CHROME_PLUGIN: false, //是否加载谷歌插件
    IS_LOAD_T3D: false, //是否加载t3d
    IS_LOAD_3D_DCV: false, //是否引用dcv
    IS_LOAD_3D_ITV: false//是否引用itv
  };
  for (var key in defaultConfig) {
    if (window[key] === undefined) {
      window[key] = defaultConfig[key];
    }
  }
  Object.defineProperties(uinv, {
    isUseNode: {
      get: function () {
        return window.IS_USE_NODE;
      }
    },
    isUse3D: {
      get: function () {
        return window.IS_LOAD_3D;
      }
    },
    useUIConfig: {
      get: function () {
        return window.IS_LOAD_3D_CONFIGURE;//与可视化配置绑定
      }
    },
    isUseU3D: {
      get: function () {
        return window.IS_LOAD_3D_U3D;
      }
    },
    isUseT3d: {
      get: function () {
        return window.IS_LOAD_T3D;
      }
    }
  });
})();
