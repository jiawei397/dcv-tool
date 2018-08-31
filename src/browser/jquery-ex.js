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
//对html对象本地化
uinv.util.localize = {};
uinv.util.localize.htmlObjDetail = function (htmlObj) {
  htmlObj.find('s').each(function () {
    if ($(this) != undefined && $(this).html() != '') {
      $(this).replaceWith(u.le.get($(this).html()));
    }
  });
};

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
