/* eslint-disable no-caller */
/**
 * 这是一个为所有模块引用前的基类，提供几个基础方法
 * 只能在浏览器使用
 * 发布模式下，会在这个文件之前添加一个变量uinv.isDist = true
 * @author jw
 * @date 2018-07-05
 */
const util: any = {};

/**
 * 判断是否谷歌浏览器
 * @author jw
 * @date 2018-05-22
 */
util.isChrome = function () {
  return /chrome/.test(navigator.userAgent.toLowerCase());
};

/**
 * 判断是否IE浏览器
 * @author jw
 * @date 2018-05-22
 */
util.isIE = function () {
  let userAgent = navigator.userAgent;
  return (/msie/i.test(userAgent.toLowerCase()) || /Trident/i.test(userAgent.toLowerCase())) && !/opera/.test(userAgent.toLowerCase());
};

/**
 * 得到当前工程名称
 * @author jw
 * @date 2017-06-13
 */
util.getProjectName = function () {
  let project = location.pathname;
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
util.getIp = function () {
  let host = location.host;
  if (host !== '') {
    return location.protocol + '//' + host;
  }
  return '';
};

/**
 * 判断当前浏览器是否64位
 * @author jw
 * @date 2016-11-19
 */
util.is64 = function () {
  let userAgent = navigator.userAgent;
  return /win64/i.test(userAgent) && /x64/i.test(userAgent);
};

/**
 * 获得url后面的参数
 * @param {String} paramName
 * @param {HTMLElement} win 窗口
 * @return {Object} 参数的属性
 * @example util.getURLParams("ID");
 */
util.getURLParams = function (paramName: string, win: Window = window) {
  return this.getURLParamsMap(win)[paramName];
};

/**
 * 读取到url的参数，放到Map里
 */
util.getURLParamsMap = function (win: Window = window) {
  let name, value, num;
  let str = win.location.search.substr(1);
  let arr = str.split('&'); // 各个参数放到数组里
  let params = {};
  for (let i = 0; i < arr.length; i++) {
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
 * 取url中某个参数，与getURLParams效果一样
 * @param {String} name 参数名称
 */
util.urlArg = function (name: string) {
  let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
  let r = location.search.substr(1).match(reg);
  if (r != null) {
    return decodeURIComponent(r[2]);
  }
  return null;
};

/**
 * 增加一个参数到Url中
 * @author jw
 * @date 2017-05-25
 */
util.addParam2Url = function (url: string, key: string, value: string) {
  let andStr = '?';
  let beforeparam = url.indexOf('?');
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
util.removeParamFromUrl = function (url: string, key: string) {
  if (url.indexOf(key) == -1) {
    return url;
  }
  let urlParam = url.substr(url.indexOf('?') + 1);
  let beforeUrl = url.substr(0, url.indexOf('?'));
  let nextUrl = '';

  let arr = [];
  if (urlParam != '') {
    let urlParamArr = urlParam.split('&');
    for (let i = 0; i < urlParamArr.length; i++) {
      let paramArr = urlParamArr[i].split('=');
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

/**
 * 动态加载js
 */
util.loadScript = function (url: string, callback: () => void) {
  let script = document.createElement('script');
  script.type = 'text/javascript';
  if (typeof callback === 'function') {
    let s = (script as any);
    if (s.readyState) {
      s.onreadystatechange = function () {
        if (s.readyState == 'loaded' || s.readyState == 'complete') {
          s.onreadystatechange = null;
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
util.requireCss = function (cssPath: string, id: string, className: string) {
  let link = document.createElement('link');
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
util.setFavicon = function (url: string) {
  let link = (document.querySelector('link[rel*="icon"]') || document.createElement('link')) as any;
  link.type = 'image/x-icon';
  link.rel = 'icon';
  link.href = url;
  document.getElementsByTagName('head')[0].appendChild(link);
};

/**
 * 移除地址栏图标
 */
util.removeFavicon = function () {
  let links = document.getElementsByTagName('link');
  let head = document.getElementsByTagName('head')[0];
  for (let i = 0; i < links.length; i++) {
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
util.getHashMap = function () {
  let hash = location.hash;
  let datas = hash.substr(1);
  let map = {};
  if (!datas) return map;
  let arr = datas.split('&');
  arr.forEach(function (str) {
    let t = str.split('=');
    map[t[0]] = decodeURIComponent(t[1]);
  });
  return map;
};

/**
 * 根据key，获取url的hash值
 * @author jw
 * @date 2017-10-17
 */
util.getHashByKey = function (key: string) {
  return this.getHashMap()[key];
};

/**
 * 获取浏览器缩放比例
 * @author jw
 * @date 2018-01-17
 */
util.detectZoom = function () {
  let ratio = 0,
    ua = navigator.userAgent.toLowerCase();

  if (typeof devicePixelRatio !== 'undefined') {
    ratio = devicePixelRatio;
  } else if (~ua.indexOf('msie')) { // IE6-9
    let sc = screen as any;
    if (sc.deviceXDPI && sc.logicalXDPI) {
      ratio = sc.deviceXDPI / sc.logicalXDPI;
    }
  } else if (typeof outerWidth !== 'undefined' && typeof innerWidth !== 'undefined') {
    ratio = outerWidth / innerWidth;
  }
  return ratio;
};

/**
 * 判断文件是否存在
 * @author jw
 * @param {String} url 文件地址，类似：http://127.0.0.1:8080/mmdb-rsm-web/base/dcv/projects/snapshot/images/C741F748-91F0-0001-D524-68801CBF1107.jpg
 */
util.isFileExist = function (url: string) {
  let xmlhttp = new XMLHttpRequest();
  xmlhttp.open('GET', url, false);
  xmlhttp.send();
  if (xmlhttp.readyState === 4) {
    return (xmlhttp.status >= 200 && xmlhttp.status < 300) || xmlhttp.status === 302;
  }
};

/**
 * 兼容多浏览器的剪切板
 */
util.setClipboardData = (function () {
  let createElementForExecCommand = function (textToClipboard: string) {
    let forExecElement = document.createElement('div');
    forExecElement.style.position = 'absolute';
    forExecElement.style.left = '-10000px';
    forExecElement.style.top = '-10000px';
    forExecElement.textContent = textToClipboard;
    document.body.appendChild(forExecElement);
    forExecElement.contentEditable = 'true';
    return forExecElement;
  };
  let selectContent = function (element: HTMLElement) {
    let rangeToSelect = document.createRange();
    rangeToSelect.selectNodeContents(element);
    let selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(rangeToSelect);
  };
  return function (value: string, key: string = 'Text') {
    let success = true;
    let win = (window as any);
    if (win.clipboardData) { // Internet Explorer
      win.clipboardData.setData(key, value);
    } else {
      let forExecElement = createElementForExecCommand(value);
      selectContent(forExecElement);
      try {
        if (win.netscape && win.netscape.security) {
          win.netscape.security.PrivilegeManager.enablePrivilege('UniversalXPConnect');
        }
        success = document.execCommand('copy', false, null);
      } catch (e) {
        success = false;
      }
      document.body.removeChild(forExecElement);
    }
    return success;
  };
})();

export default util;
