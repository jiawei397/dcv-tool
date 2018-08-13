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
// error对象
uinv.error = uinv.error || {};

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

// error
uinv.error.handle = function (e) {
  if ($ && !$.browser.msie) {
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

// 检测jQuery
if (!window.jQuery) {
  uinv.error.show('[error]\r\n没有找到jQuery.');
}
// jquery 扩展
(function ($) {
  $.fn.language = function () {
    var baseLang = navigator.userLanguage || navigator.language;
    return baseLang.substring(0, 2).toLowerCase();
  };
})(jQuery);

jQuery.extend({
  /**
   * 将字符串转换为对象
   */
  jsonTo: uinv.jsonParse,
  /**
   * 将javascript数据类型转换为字符串
   * @param {Object} 待转换对象,支持object,array,string,function,number,boolean,regexp
   * @return 返回json字符串
   */
  toJson: uinv.stringify
});

// 启动显示异常
$(document).ready(function () {
  uinv.error.show();
});

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
 * 网页播放器
 */
uinv.util.simpleWebSoundPlayer = {
  play: function (url) {
    if (!document.getElementById('player')) {
      $('body').append('<div id="player"></div>');
    }
    this.remove();
    document.getElementById('player').innerHTML = '<object height="0" width="0" classid="CLSID:6BF52A52-394A-11d3-B153-00C04F79FAA6"><param NAME="AutoStart" VALUE="1" /><param NAME="url" value="' + url + '" /></object>';
  },
  remove: function () {
    document.getElementById('player').innerHTML = '';
  }
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

//对html对象本地化
uinv.util.localize = {};
uinv.util.localize.htmlObjDetail = function (htmlObj) {
  htmlObj.find('s').each(function () {
    if ($(this) != undefined && $(this).html() != '') {
      $(this).replaceWith(u.le.get($(this).html()));
    }
  });
};

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
if (typeof $ajaxCache !== 'undefined') {
  $ajaxCache.config(uinv.ajaxCacheCfg);
  //根据ajax参数配置，生成一个md5戳
  $ajaxCache.getKey = function (options, originalOptions) {
    return this.cacheProxy.genCacheKey(options, originalOptions, this.cacheProxy.preGenCacheKey);
  };
}

/**
 * 国际化
 */
uinv.language = window.uinv.language || {};
if (localStorage.language && localStorage.language !== 'undefined' && localStorage.language !== '') {
  uinv.language.type = localStorage.language;
} else if (uinv.util.getURLParams('language')) {
  uinv.language.type = uinv.util.getURLParams('language').substring(0, 2).toLowerCase();// 语言类型 此处设定后 优先级最高
}

uinv.language.load = function (type) {
  this.initType(type);
  if (this.version == uinv.data('language_version') && uinv.data(this.type)) { // 读取localStorage中内容
    uinv.language.resource = uinv.data(this.type);
  } else {
    this.remoteLoad();
  }
};

uinv.language.initType = function (type) {
  this.type = type || this.type;
  if (!this.type) { // 未指定则自动判断
    var leArg = uinv.util.urlArg('language') || $('body').language();
    if (leArg) {
      this.type = leArg;
    } else {
      this.type = 'en';
    }
  }
  localStorage.language = this.type;
};

/**
 * 读取远程服务器上国际化文件
 * @author jw
 * @date 2016-11-14
 */
uinv.language.remoteLoad = function () {
  var that = this;
  $.ajax({
    async: false,
    url: uinv.basePath + 'resource/language/' + this.type + '.json',
    success: function (data) {
      that.resource = uinv.jsonParse(data);
      uinv.data(that.type, data);
      uinv.data('language_version', that.version);
    },
    error: function () {
      alert('Failed to read the language pack');// 读取语言包失败
    }
  });
};

/**
 * 移除和遮挡页面，等翻译完成之后再还原
 */
uinv.language.loadFunc = function (obj) {
  //这里固定写了#divLoaded和#divLoading
  if (obj) {
    $('#divLoaded').attr('style', 'position: absolute;left:9999px;');
    $('#divLoading').attr('style', 'position: absolute;left:80px;top:30px;');
  } else {
    $('#divLoaded').attr('style', '');
    $('#divLoading').attr('style', 'width:0;display:none;');
  }
};

//页面初始化时自动加载默认皮肤包,页面加载时直接执行
/**
 * @description 国际化
 * @author PKG
 * @date {2014-02-20}
 */
uinv.language.translate = function () {
  uinv.language.loadFunc(true);
  // uweb.skin.loadSkin();//jw 2017.05.27 不明白每次都加载的意义
  $('s').each(function () {
    if ($(this) != undefined && $(this).html != '' && !$(this).data('translated')) {
      $(this).replaceWith(u.le.get($(this).html()));
      $(this).data('translated', true);
    }
  });
  $('P,select option').each(function () {
    if ($(this) != undefined && $(this).html != '' && !$(this).data('translated')) {
      $(this).html(u.le.get($(this).html()));
      $(this).data('translated', true);
    }
  });
  $('a,input:not([type=checkbox],[type=radio])').each(function () {
    if ($(this) != undefined && !$(this).data('translated')) {
      if ($(this).val() != '') {
        $(this).val(u.le.get($(this).val()));
      }
      if ($(this).attr('title') != '') {
        $(this).attr({'title': u.le.get($(this).attr('title'))});
      }
      if ($(this).attr('placeholder') != '') {
        $(this).attr({'placeholder': u.le.get($(this).attr('placeholder'))});
      }
      $(this).data('translated', true);
    }
  });
  $('select').each(function () {
    if ($(this) != undefined && $(this).data('placeholder') != '' && !$(this).data('translated')) {
      $(this).data('placeholder', u.le.get($(this).data('placeholder')));
      $(this).data('translated', true);
    }
  });
  uinv.language.loadFunc(false);
};

/**
 * 清除ajax的缓存
 * @author jw
 * @date 2017-04-28
 */
uinv.clearAjaxCache = function () {
  for (var key in localStorage) {
    if (key.length == 32) {
      localStorage.removeItem(key);
    }
  }
};

/**
 * 删除无数据的ajax缓存
 * @author jw
 * @date 2017-05-10
 */
uinv.clearNoDataAjaxCache = function () {
  for (var key in localStorage) {
    if (key.length == 32) {
      var data = $.jsonTo($.jsonTo($.jsonTo(localStorage[key]).v)).data;
      if (!data || data.length == 0) {
        localStorage.removeItem(key);
      }
    }
  }
};

/**
 * 自定义ajax
 * @author jw
 * @date 2016.07.28
 * @param {Object} config
 *    example
 *    {
 *      ajaxCache:false,//默认不开启缓存模式，缓存的话，将之设置为true，或者类似{storageType: 'sessionStorage',timeout: 60 * 3 //选填， 单位秒}或者uinv.ajaxCache=true
 * 			url:uinv.server.manager.operation.url + 'getDownDataChainByTerm',
 * 			type:'POST',//参数传递方式，默认为POST
 * 		  async:true,//是否异步，因为有时候程序必须要同步处理。没有这个参数时，用fun判断，有fun回调时，为异步（async = true），否则为同步（async = false）
 * 			fun:fun,
 * 		  errorFun:errorFun,//错误回调
 * 			data:{"jsonIds":["aaa","bbb"],"isAs":true}, //json或字符串 为避免后台出错，上传文件时的data参数要把file写到第1个
 * 			isFile:false,	//为true时，代表为formData表单上传文件，此时data中要上传的文件类似以下格式：{file:document.getElementById('fileName').files[0]}
 * 		  isDownload:false, //为true时，代表是用流的方式下载，这时是创建了一个form表单
 * 		  timeout:120000,//超时时间120s
 * 		  isGetData:true //是否直接要返回的data数据
 * 			isShowAlert:true //为false时，不再弹出提示
 * 		  check:{ //校验参数，目前包括3个参数：func为校验函数，执行为false时意味着参数不符合要求，拦截ajax请求；default为返回的默认数据，不设置时，将使用type；type为返回数据默认类型，可为Array|Object|Boolean|String|Number
 * 		    func:function(){return xx>0;},
 * 		    default:'haha',
 * 		    type:'String'
 * 		  }
 * 		}
 * @return 同步请求，返回具体值；异步请求，返回promise，可用then进行链式处理成功或失败
 */
uinv.util.ajax = function (config) {
  return uinv.util._ajax(config, $.ajax);
};

////////////////////////////////////以下是node里用到的//////////////////////////

/**
 * 注销空转函数，用的较多，也提取出来
 * @author jw
 * @date 2017-08-16
 */
uinv.util.unRegIdleFunc = function (name) {
  uinv.invokeNode({
    path: 'uinv.util.unRegIdleFunc',
    param: name
  });
};
/**
 * 显示进度条
 * @param {String} percent 进度百分比
 * @param {String} str  进度条上显示的内容
 * @param {Boolean} showNumberElment 数字百分比是否显示
 * @example
 * uinv.util.showProgressBar(0.25 + (0.5 - 0.25) * prog.percent / 100, [ "下载模型进度:{0}%", prog.percent], true   );
 */
uinv.util.showProgressBar = function (percent, str, showNumberElment) {
  uinv.invokeNode({
    path: 'uinv.util.showProgressBar',
    param: [percent, str, showNumberElment]
  });
};

/**
 * 浏览器网页增加图标
 * 页面上最好先有id为favicon
 * @author jw
 * @date 2017-07-14
 */
uinv.util.addIcon = function (iconUrl) {
  $('link').each(function () {
    if ($(this).attr('type') == 'image/x-icon' && $(this).attr('id') !== 'favicon') {
      $(this).remove();
    }
  });
  if (!iconUrl) {
    iconUrl = uinv.basePath + 'resource/images/favicon.ico';
  }
  if ($('#favicon').length > 0) {
    $('#favicon').attr('href', iconUrl);
  } else {
    $('head').append('<link rel="shortcut icon" href="' + iconUrl + '" type="image/x-icon"/>');
  }
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

// uinv.ajaxCache = true;

/**
 * 事件处理器，现在统一用config_tools.js
 * @deprecated
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

/**
 * 重写声音播放器
 */
uinv.util.soundPlayer = {
  play: function (param) {
    // soundManager.stopAll();
    // var mySound = soundManager.createSound({id: param.trackName, url: param.url, loops: param.loops});
    var mySound = soundManager.createSound({id: param.trackName});
    mySound.load({url: param.url});
    mySound.stop();
    mySound.play({loops: param.loops}); // 解决声音时候循环播放的问题，当loops值为1的时候只播放一次，当loops值为3的时候循环播放。根据源码来看参数记录上次的数据，需要再次写入可以解决此问题
    if (!this.lib) this.lib = [];
    this.lib.push(param);
  },
  stop: function (trackName) {
    var mySound = soundManager.getSoundById(trackName);
    if (mySound) mySound.stop();
    for (var i = 0; i < this.lib.length; i++) {
      if (this.lib[i]['trackName'] == trackName) {
        this.lib.splice(i, 1);
      }
    }
  },
  pause: function (trackName) {
    if (trackName === undefined) trackName = 'default';
    var mySound = soundManager.getSoundById(trackName);
    if (mySound) mySound.pause();
  },
  resume: function (trackName) {
    if (trackName === undefined) trackName = 'default';
    var mySound = soundManager.getSoundById(trackName);
    if (mySound) mySound.resume();
  },
  stopAll: function () {
    if (this.lib) {
      for (var i = 0; i < this.lib.length; i++) {
        this.stop(this.lib[i]['trackName']);
        // soundManager.destroySound(this.lib[i]["trackName"]);
      }
    }
  },
  snapshot: function () {
    return this.lib;
  },
  recover: function (datas) {
    for (var i = 0; i < datas.length; i++) {
      var isPalying = false;
      if (this.lib && this.lib.length > 0) {
        for (var y = 0; y < this.lib.length; y++) {
          if (this.lib[y]['trackName'] == datas[i]['trackName']) {
            isPalying = true;
          }
        }
      }
      if (!isPalying) {
        this.play(datas[i]);
      }
    }
  },
  isRecoverOk: function () {
    return true;
  },
  recoverClear: function (datas) { //如果传回来的参数是空的,就停止现在播放的声音
    if (!datas || datas == '') {
      this.stopAll();
    } else {
      if (this.lib && this.lib.length > 0) {
        for (var y = 0; y < this.lib.length; y++) {
          var isSame = false;
          for (var i = 0; i < datas.length; i++) {
            if (datas[i]['trackName'] == this.lib[y]['trackName']) {
              if (datas[i]['file'] != this.lib[y]['file']) {
                isSame = true;
              }
            }
          }
          if (isSame) {
            this.stop(this.lib[y]['trackName']);
          }
        }
      }
    }
  }
};

/**
 * 是否使用node
 * 存储到localStorage里
 * @author jw
 * @date 2017-08-22
 */
// (function () {
//   if (uinv.util.isChrome()) {
//     uinv.isUseNode = true;
//   } else {
//     uinv.isUseNode = uinv.data('isUseNode') == null ? false : uinv.data('isUseNode');
//   }
// })();
