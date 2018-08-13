/**
 * Created by Administrator on 2017/8/2.
 */
var http = require('http');
var https = require('https');
var util = require('util');
var events = require('events');
var httpsync = require('http-sync');
var uinv = global.uinv || {};

// http.globalAgent.keepAlive = true;
// http.globalAgent.maxSockets = Infinity;
// https.globalAgent.keepAlive = true;
// https.globalAgent.maxSockets = Infinity;

uinv.Cache = function () {
  this.map = {};
};
uinv.Cache.prototype.setItem = function (key, value) {
  this.map[key] = value;
};
uinv.Cache.prototype.getItem = function (key) {
  return this.map[key];
};
uinv.Cache.prototype.removeItem = function (key) {
  delete this.map[key];
};
uinv.Cache.prototype.clear = function () {
  this.map = {};
};
uinv.cache = new uinv.Cache();
uinv.util.webStorageCache = new WebStorageCache({
  exp: uinv.ajaxCacheCfg.timeout, //默认不设置时会永久有效，这里和前端一样用它来控制
  storage: uinv.cache
});

/**
 * 加个timeout处理
 */
var requestFun = function (_request) {
  return function (options, callback) {
    var timeout = options['timeout'], timeoutEventId;
    var req = _request(options, function (res) {
      res.on('end', function () {
        clearTimeout(timeoutEventId);
        // console.log('response end...');
      });

      res.on('close', function () {
        clearTimeout(timeoutEventId);
        // console.log('response close...');
      });

      res.on('abort', function () {
        // console.log('abort...');
      });

      callback(res);
    });

    //超时
    req.on('timeout', function () {
      req.res && req.res.abort && req.res.abort();
      req.abort();
    });

    //如果存在超时
    timeout && (timeoutEventId = setTimeout(function () {
      req.emit('timeout', {message: 'have been timeout...'});
    }, timeout));
    return req;
  };
};
http.request = requestFun(http.request);
https.request = requestFun(https.request);

/**
 * 生成key
 * @private
 */
uinv.util.defaultPreGenCacheKey = function (ajaxOptions) {
  var dataOrigin = ajaxOptions.data || {};
  var key, dataString, type = ajaxOptions.type || 'post';
  if (typeof dataString !== 'string') {
    dataString = uinv.stringify(dataOrigin);
  }
  key = ajaxOptions.url + type.toUpperCase() + (dataString || '');
  return key;
};

/**
 * 获取校验数据方法
 * @private
 */
uinv.util.getCacheValidateFun = function (ajaxOptions) {
  if (ajaxOptions && uinv.isObject(ajaxOptions.ajaxCache) && ajaxOptions.ajaxCache.cacheValidate) {
    return ajaxOptions.ajaxCache.cacheValidate;
  }
  return uinv.ajaxCacheCfg.cacheValidate;
};

/**
 * 自定义ajax
 * @author jw
 * @date 2016.07.28
 * @param {Object} config
 *    example
 *    {
 *      ajaxCache:false,//默认不开启缓存模式，缓存的话，将之设置为true，或者uinv.ajaxCache=true
 * 			url:uinv.server.manager.operation.url + 'getDownDataChainByTerm',
 * 			type:'POST',//参数传递方式，默认为POST
 * 		  async:true,//是否异步，因为有时候程序必须要同步处理。没有这个参数时，用fun判断，有fun回调时，为异步（async = true），否则为同步（async = false）
 * 			fun:fun,
 * 		  errorFun:errorFun,//错误回调
 * 			data:{"jsonIds":["aaa","bbb"],"isAs":true}//json或字符串 为避免后台出错，上传文件时的data参数要把file写到第1个
 * 			isFile:false	//为true时，代表为formData表单上传文件，此时data中要上传的文件类似以下格式：{file:document.getElementById('fileName').files[0]}
 * 		  timeout:120000,//超时时间120s
 * 		  isGetData:true //是否直接要返回的data数据
 * 			isShowAlert:true //为false时，不再弹出提示
 * 		  check:{ //校验参数，目前包括3个参数：func为校验函数，执行为false时意味着参数不符合要求，拦截ajax请求；default为返回的默认数据，不设置时，将使用type；type为返回数据默认类型，可为Array|Object|Boolean|String|Number
 * 		    func:function(){return xx>0;},
 * 		    default:'haha',
 * 		    type:'String'
 * 		  }
 * 		}
 */
uinv.util.ajax = (function () {
  var getXhr = function (res, status, responseText) {
    var statusText = (res && res.statusMessage === 'ETIMEDOUT') ? 'timeout' : (res && res.statusMessage);
    var responseText = responseText || (res && res.body && res.body.toString());
    return {
      statusText: statusText, //状态信息
      status: status,
      responseText: responseText, //返回信息，也会是错误信息
      getResponseHeader: function (name) {
        if (res) {
          return res.getHeader ? res.getHeader(name) : (res.headers && res.headers[name.toLowerCase()]);
        }
      }
    };
  };
  var errorFun = function (res, ajaxConfig, status) {
    var xhr = getXhr(res, status);
    ajaxConfig.error(xhr, xhr.statusText, xhr.responseText);
    return xhr;
  };
  var catchFun = function (e, ajaxConfig) {
    var xhr = getXhr(null, 404, e.message);
    ajaxConfig.error(xhr, xhr.statusText, xhr.responseText);
    console.error(e, ajaxConfig);
    return xhr;
  };

  return function (config) {
    var endFun = function (ajaxConfig, result, res) {
      var status = res.statusCode;
      if ((status >= 200 && status < 300) || status === 304) { //代表成功
        ajaxConfig.success(result);
        var ajaxCache = uinv.util.getAjaxCache(config);
        if (ajaxCache) {
          var key = md5(uinv.util.defaultPreGenCacheKey(config));
          var cacheValidateFun = uinv.util.getCacheValidateFun(config);
          if (uinv.isFunction(cacheValidateFun)) {
            if (cacheValidateFun.call(null, result, config)) {
              var exp;
              if (uinv.isObject(ajaxCache)) {
                exp = ajaxCache.timeout;
              }
              console.log('exp:' + exp);
              uinv.util.webStorageCache.set(key, result, {exp: exp});
            }
          }
        } else {
          ajaxConfig.complete(getXhr(res, status, result), status);
        }
      } else {
        var xhr = errorFun(res, ajaxConfig, status);
        ajaxConfig.complete(xhr, status);
      }
    };

    /**
     * 类似于jquery的ajax方法，供uinv.util._ajax调用
     */
    var ajaxFun = function (ajaxConfig) {
      if (ajaxConfig.ajaxCache) { //在node中且使用缓存
        var key = md5(uinv.util.defaultPreGenCacheKey(ajaxConfig));
        var value = uinv.util.webStorageCache.get(key);
        if (value) {
          ajaxConfig.success(value);
          return;
        }
      }
      var headers = ajaxConfig.headers;
      if (ajaxConfig.contentType) {
        headers['Content-Type'] = ajaxConfig.contentType;
      }
      var path = config.url;
      var hostname = uinv.hostname;
      var port = uinv.port;
      var protocol = uinv.protocol;
      var ip = uinv.dcvIp;
      if (path.startsWith('http')) {
        var myUrl = new URL(path);
        path = myUrl.pathname;
        hostname = myUrl.hostname;
        port = myUrl.port;
        protocol = myUrl.protocol;
        ip = protocol + '//' + hostname + ':' + port;
      }
      if (!ajaxConfig.async) { //同步
        var req = httpsync.request({
          rejectUnauthorized: false, //忽略证书错误
          url: ip + path,
          body: ajaxConfig.data,
          method: ajaxConfig.type,
          headers: headers
        });
        req.setTimeout(ajaxConfig.timeout);
        try {
          var res = req.end();
          var result = res.body ? res.body.toString() : '';
          endFun(ajaxConfig, result, res);
        } catch (e) {
          catchFun(e, ajaxConfig);
        }
      } else {
        var proto = uinv.protocol === 'https:' ? https : http;
        var requestFun = proto.request;
        // const keepAliveAgent = new proto.Agent({
        //   keepAlive: true
        // });
        var newAjaxConfig = {
          // agent: false,
          rejectUnauthorized: false, //忽略证书错误
          path: path,
          hostname: hostname,
          port: port,
          protocol: protocol,
          method: ajaxConfig.type,
          headers: headers
        };
        ajaxConfig = uinv.hash.combine(ajaxConfig, newAjaxConfig);
        var req = requestFun(ajaxConfig, function (res) {
          var back = '';
          res.on('data', function (chunk) {
            back += chunk;
          });
          res.on('end', function () {
            endFun(ajaxConfig, back, res);
          });
        });
        req.on('error', function (e) {
          catchFun(e, ajaxConfig);
        });
        if (ajaxConfig.data) {
          req.write(ajaxConfig.data);
        }
        req.end();
      }
    };
    return uinv.util._ajax(config, ajaxFun);
  };
})();

/**
 * 国际化
 */
uinv.language = uinv.language || {};
uinv.language.load = function () {
  this.remoteLoad();
};

/**
 * 读取远程服务器上国际化文件
 * @author jw
 * @date 2016-11-14
 */
uinv.language.remoteLoad = function () {
  var that = this;
  uinv.util.ajax({
    type: 'get',
    url: uinv.basePath + 'resource/language/' + this.type + '.json',
    fun: function (data) {
      that.resource = data;
    }
  });
};
u.le.load();

/**
 * 事件处理器，现在统一用config_tools.js
 * @deprecated
 * @author jw
 * @date 2017-08-17
 */
uinv.EventEmitter = function () {
  events.EventEmitter.call(this);
};
util.inherits(uinv.EventEmitter, events.EventEmitter);
uinv.EventEmitter.prototype.reg = function () {
  if (Array.isArray(arguments[0])) {
    arguments[0] = arguments[0][0];
  }
  // console.log(Array.prototype.slice.call(arguments));
  this.on.apply(this, arguments);
};
uinv.EventEmitter.prototype.regOnce = function () {
  if (Array.isArray(arguments[0])) {
    arguments[0] = arguments[0][0];
  }
  this.once.apply(this, arguments);
};
uinv.eventEmitter = new uinv.EventEmitter();

// uinv.ajaxCacheCfg = {};
// uinv.isUseNode = true;//在node里，这个变量自然是true
