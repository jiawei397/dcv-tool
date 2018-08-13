/**
 * 浏览器端用到的公用方法
 * @author jw
 * @date 2017-08-02
 */
uinv = window.uinv || {};
// util对象
uinv.util = uinv.util || {};
// debug对象
uinv.debug = uinv.debug || {};

/**
 * 检查是否已登陆
 * @author jw
 * @date 2017-09-27
 */
uinv.checkLogin = function () {
  if (!uinv.cookie('token')) {
    uinv.toLogin();
    return false;
  }
  return true;
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

uinv.util.requireGlobalPath = '';
uinv.util.require = function (url, random) {
  var include = function (url, cache) {
    var isCSS = url.endsWith('.css');
    var tag = isCSS ? 'link' : 'script';
    var attr = isCSS ? ' type="text/css" rel="stylesheet" ' : ' language="javascript"  type="text/javascript" ';

    uinv.ver = uinv.ver ? uinv.ver : '0.0.0';
    url = uinv.util.addParam2Url(url, 'ver', uinv.ver);
    if (cache) {
      url = uinv.util.addParam2Url(url, '_', new Date().getTime());
    }
    var link = (isCSS ? 'href' : 'src') + '="' + url + '"';
    if ($(tag + '[' + link + ']').length == 0) {
      var html = isCSS ? '<' + tag + attr + link + ' />' : '<' + tag + attr + link + '></' + tag + '>';
      document.write(html);
    }
  };
  var root = '';// uinv.util.getRoot();
  var urls = (typeof url == 'string') ? [url] : url;
  for (var i = 0; i < urls.length; i++) {
    url = urls[i].trim();
    if (url) {
      url = (uinv.util.requireGlobalPath != '' && !url.startsWith('dwr')) ? (uinv.util.requireGlobalPath + url) : url;
      if (!url.startsWith('http://')) { // 添加前缀路径
        url = root + url;
      }
      if (!(url.endsWith('.css') || url.endsWith('.js') || url.has('?'))) { // 判断默认js
        url = url + '/app.js';
      }
      if (random) {
        url = uinv.util.addParam2Url(url, '__', new Date().getTime());
      }
      var cache = uinv.debug.state;// cache加载
      include(url, cache);
    }
  }
};

/**
 * JSONP
 * @param {String} url
 * @param {function} callback
 */
uinv.util.getJSON = function (url, callback) {
  var head = document.getElementsByTagName('head')[0];
  var now = (new Date()).getTime();
  var jsonp = 'jsonp' + now++;
  if (url.indexOf('?') > -1) {
    url += '&callback=' + jsonp;
  } else {
    url += '?callback=' + jsonp;
  }
  url += '&nocache=' + (new Date());

  var script = document.createElement('script');
  script.setAttribute('src', url);
  script.setAttribute('type', 'text/javascript');
  script.setAttribute('charset', 'utf-8');
  head.appendChild(script);

  window[jsonp] = function (tmp) {
    if (typeof callback == 'function') {
      if (callback) {
        callback(tmp);
      }
    }
    window[jsonp] = undefined;
    try {
      delete window[jsonp];
    } catch (jsonpError) {
    }
    if (head) {
      head.removeChild(script);
    }
  };
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


/**
 * 校验不符合格式的字符串，并处理按钮状态
 * @author jw
 * @date 2016-11-22
 * @param {Object} obj input对象
 * @param {Function} replaceFun 替换方法，若没有，默认用uinv.util.replaceMark
 */
uinv.util.timeReplaceMark = function (obj, replaceFun) {
  //TODO 下面这2处不知道什么时候被去掉了
  //获取光标位置
  // function getCursor(elem) {
  //   //IE 9 ，10，其他浏览器
  //   if (elem.selectionStart !== undefined) {
  //     return elem.selectionStart;
  //   } //IE 6,7,8
  //   var range = document.selection.createRange();
  //   range.moveStart('character', -elem.value.length);
  //   var len = range.text.length;
  //   return len;
  // }
  //
  // //设置光标位置
  // function setCursor(elem, index) {
  //   //IE 9 ，10，其他浏览器
  //   if (elem.selectionStart !== undefined) {
  //     elem.selectionStart = index;
  //     elem.selectionEnd = index;
  //   } else { //IE 6,7,8
  //     var range = elem.createTextRange();
  //     range.moveStart('character', -elem.value.length); //左边界移动到起点
  //     range.move('character', index); //光标放到index位置
  //     range.select();
  //   }
  // }

  if (uinv.util.testMark(obj.value)) {
    if (typeof replaceFun !== 'function') {
      replaceFun = uinv.util.replaceMark;
    }
    obj.value = replaceFun(obj.value, true);
  } else if (/'/.test(obj.value)) {
    var tempValue = obj.value.replace(/'/gi, '');
    if (tempValue == '') { //如果全是''，代表不是输入词语，可以替换
      obj.value = tempValue;
    }
  } else if (/"/.test(obj.value)) {
    var tempValue = obj.value.replace(/"/gi, '');
    if (tempValue == '') { //如果全是''，代表不是输入词语，可以替换
      obj.value = tempValue;
    }
  }
};

/**
 * 事件处理器，现在统一用config_tools.js
 * @author jw
 * @date 2017-08-17
 */
uinv.EventEmitter = function () {
  this._listener = {};
};
uinv.EventEmitter.prototype.reg = function (type, fn) {
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
uinv.EventEmitter.prototype.emit = function (type) {
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
uinv.EventEmitter.prototype.un = function (type, key) {
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
uinv.eventEmitter = new uinv.EventEmitter();
