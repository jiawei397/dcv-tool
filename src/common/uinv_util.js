uinv.util = uinv.util || {};
if (!uinv.util._mockURLArr) {
  uinv.util._mockURLArr = [];
  uinv.util._mockURLMap = {};
}

/**
 * 本地做个ajax拦截
 * @author jw
 * @date 2018-03-01
 */
uinv.mock = function (url, result) {
  if (uinv.util._mockURLMap[url]) {
    uinv.util._mockURLArr.map(function (obj) {
      if (obj.key === url) {
        obj.value = result;
      }
    });
  } else {
    uinv.util._mockURLArr.push({
      key: url,
      value: result
    });
  }
  uinv.util._mockURLMap[url] = result;
};

/**
 * 模拟ajax，返回我们的格式
 * @param data 模拟数据
 * @param fun 回调函数
 * @param async 是否异步
 * @param isGetData 是否只取数据
 */
uinv.mockResult = function (data, fun, async, isGetData) {
  if (async === undefined) {
    async = uinv.isFunction(fun);
  }
  var result = {
    data: data,
    code: -1,
    success: true
  };
  if (uinv.isFunction(fun)) {
    if (isGetData) {
      fun(data);
    } else {
      fun(result);
    }
  }
  if (async) {
    return Q.resolve(data);
  }
  if (isGetData) {
    return data;
  }
  return result;
};

uinv.util.ramdom = function (a, b) {
  return Math.ceil(uinv.random() * (a - b + 1) + b);
};
uinv.util.isNumber = function (obj) {
  return (typeof obj == 'number') && obj.constructor == Number;
};
uinv.util.isArray = function (obj) {
  return (typeof obj == 'object') && obj.constructor == Array;
};
uinv.util.isString = function (str) {
  return (typeof str == 'string') && str.constructor == String;
};

/**
 * 节流器
 * @author jw
 * @date 2017-11-29
 */
uinv.util.throttle = (function () {
  var map = {};
  var throttle = function () {
    //获取第一个参数
    var isClear = arguments[0], fn, _throttleID;
    //如果第一个参数是boolean类型那么第一个参数则表示是否清除计时器
    if (typeof isClear === 'boolean') {
      //第二个参数为id
      var id = arguments[1];
      _throttleID = map[id];
      if (_throttleID) {
        clearTimeout(_throttleID);
        delete map[id];
      }
      //通过计时器延迟函数的执行
    } else {
      //第一个参数为函数
      fn = isClear;
      //第二个参数为函数执行时的参数
      var param = arguments[1];
      //对执行时的参数适配默认值，这里我们用到以前学过的extend方法
      var p = uinv.hash.combine({
        id: 'throttle_id', //增加一个id，用来获取setTimeout的id
        context: null, //作用域
        args: [], //相关参数
        time: 300//延迟执行的时间
      }, param);
      throttle(true, p.id);//清除计时器
      _throttleID = setTimeout(function () {
        //执行函数
        fn.apply(p.context, p.args);
      }, p.time);
      map[p.id] = _throttleID;
    }
  };
  return throttle;
})();

/**
 * 国际化
 * @param {Array|String} msg 数组或字符串
 * @author jw
 * @date 2017-10-20
 */
uinv.util.getMsg = (function () {
  var fun = function (msg) {
    if (msg instanceof Array) {
      for (var i = 0; i < msg.length; i++) {
        if (msg[i] instanceof Array) {
          var temp = fun(msg[i]);
          if (temp != false) { //国际化成功
            msg[i] = temp;
          }
        }
      }
      return u.le.get(msg[0], msg[1]);
    }
    return u.le.get(msg);
  };
  return fun;
})();

uinv.util.STOPAJAX_ERROR = 'stopAjax';
/**
 * 停止ajax
 */
uinv.util.stopAjax = function () {
  uinv.util._stopAjax_ = true;
};

uinv.util.isAjaxStopped = function () {
  return uinv.util._stopAjax_;
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
uinv.util._ajax = function (config, ajaxFun) {
  if (uinv.util.isAjaxStopped()) {
    return Q.reject(uinv.util.STOPAJAX_ERROR);
  }
  var back, fun = config.fun, async = config.async === undefined ? uinv.isFunction(fun) : !!config.async,
    data = config.data, type = config.type || 'POST', isFile = config.isFile, timeout = config.timeout || 120000,
    isDownload = config.isDownload, url = config.url;
  for (var i = 0, len = uinv.util._mockURLArr.length; i < len; i++) {
    var key = uinv.util._mockURLArr[i].key;
    var result = uinv.util._mockURLArr[i].value;
    if ((typeof key === 'object' && key.test(url))
      || (typeof key === 'string' && url.indexOf(key) !== -1)) {
      var hasGetData = false;
      if (config.isGetData && result.data !== undefined) {
        back = result.data;
        hasGetData = true;
      } else {
        back = result;
      }
      if (async) {
        uinv.isFunction(fun) && fun(back);
        return Q.resolve(hasGetData ? back : back.data);
      }
      return back;
    }
  }

  var ajaxCache = uinv.util.getAjaxCache(config);
  var isShowAlert = config.isShowAlert === undefined ? true : config.isShowAlert;
  var token = config.token || uinv.token;
  var headers = config.headers || {token: token};//测试环境这里还得加token，不然跨域的情况下，cookie是传递不过去的
  var check = config.check;//校验参数
  var deferred = Q.defer(); //在函数内部，新建一个Deferred对象
  if (check) {
    if (uinv.isFunction(check.func)) {
      var b = check.func();
      if (!b) { //校验失败
        var backData = check.default;
        if (backData === undefined) {
          var rtType = check.type;
          if (rtType == 'Array') {
            backData = [];
          } else if (rtType == 'Object') {
            backData = {};
          } else if (rtType == 'Boolean') {
            backData = true;
          } else if (rtType == 'String') {
            backData = '';
          } else if (rtType == 'Number') {
            backData = 0;
          } else {
            backData = null;
          }
        }
        back = {
          'success': check.success === undefined ? true : check.success,
          'data': backData
        };
        uinv.isFunction(fun) && fun(back);
        var _back = config.isGetData ? backData : back;
        if (!async) {
          return _back;
        }
        deferred.reject(_back);
        return deferred.promise;
      }
    }
  }

  if (uinv.isUseNode && uinv.isInNode()) {
    if (isDownload || isFile) { // 如果是下载后台返回的流，用form表单提交的方式来处理，nodejs里无法使用
      // t3djs.util.printConsole("nodejs里无法使用此方法");
      if (typeof config.printConsole === 'function') {
        config.printConsole('nodejs里无法使用此方法');
      }
      return Q.reject('nodejs里无法使用此方法');
    }
  } else {
    if (isDownload) { // 如果是下载后台返回的流，用form表单提交的方式来处理
      if ($('#temp_iframe').length == 0) {
        $('body').append('<iframe id="temp_iframe" name="temp_iframe" style="display:none;"></iframe>');
      }
      var form = '<form action="' + config.url + '" method="' + type.toLowerCase() + '" target="temp_iframe">';
      var isHasToken = false;
      if (data && typeof data === 'object') {
        for (var key in data) {
          if (!data[key] || data[key] == 'null') {
            data[key] = '';
          } else if (key == 'token') {
            isHasToken = true;
          }
          form += '<input type="text" name="' + key + '" value="' + data[key] + '"/>';
        }
      }
      if (!isHasToken) {
        form += '<input type="text" name="token" value="' + token + '"/>';
      }
      form += '</form>';
      $(form).appendTo('body').submit().remove();
      uinv.isFunction(fun) && fun();
      deferred.resolve();
      return deferred.promise;
    }
  }

  var tempAlert = function (config, back) {
    if (back && back.message) {
      uinv.util.alert(back.message, !isShowAlert);
      if (uinv.isFunction(config.printConsole)) {
        config.printConsole(back.message);
      }
      deferred.reject(u.le.get(back.message));
    } else {
      deferred.reject(back === undefined ? false : typeof back === 'string' ? u.le.get(back) : back);
    }
  };
  var tempSuccessFun = function (fun, config) {
    if (back && back.success === true) {
      deferred.resolve(uinv.jsonParse(back.data));//截取返回数据值
      if (config.isGetData && back.data !== undefined) {
        back = back.data;
      }
      uinv.isFunction(fun) && fun(back);
    } else { //后台返回的错误信息
      if (config.url.endsWith('.json')) {
        uinv.isFunction(fun) && fun(back);
        deferred.resolve(back);
      } else {
        tempAlert(config, back);//jw 2017.11.14 有错误信息就提示
        if (uinv.isFunction(config.errorFun)) {
          config.errorFun(back);
        }
        if (config.isGetData) {
          back = false;
        }
      }
    }
  };
  var ajaxConfig = {
    ajaxCache: ajaxCache, //是否使用缓存，默认为否
    url: config.url,
    type: type,
    data: data,
    async: async,
    timeout: timeout,
    dataType: 'text', //jw 2017.04.21 返回值为001的时候，如果不设置text，则会变成1
    headers: headers,
    success: function (data, textStatus) {
      if (uinv.util.isAjaxStopped() || !data) {
        return deferred.reject(uinv.util.STOPAJAX_ERROR);
      }
      back = uinv.jsonParse(data);
      if (back.code == 401) { //token过期
        uinv.toLogin();
      }
      tempSuccessFun(fun, config);
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      if (uinv.util.isAjaxStopped()) {
        return deferred.reject(uinv.util.STOPAJAX_ERROR);
      }
      var status = XMLHttpRequest.status;
      if (status == 401) { //没有权限，token过期
        uinv.toLogin();
      } else if (status === 404) {
        back = {
          success: false,
          message: 'DCV_REQUEST_ERROR'
        };
      } else if (textStatus == 'timeout') {
        back = {
          success: false,
          message: 'DCV_REQUEST_TIMEOUT'
        };
      } else {
        back = uinv.jsonParse(XMLHttpRequest.responseText);
      }
      tempAlert(config, back);
      uinv.isFunction(config.errorFun) && config.errorFun(back);
      back = false;
    },
    complete: function (XMLHttpRequest, status) {
      if (XMLHttpRequest.status == 210) { //jw 2017.07.03 token即将过期，重新刷新一下token
        uinv.util.refreshToken();
      }
      uinv.isFunction(config.completeFun) && config.completeFun(XMLHttpRequest, status);
    }
  };

  var tempConfig;
  if (isFile) {
    var formData = new FormData(); //构造空对象，下面用append 方法赋值。
    for (var key in data) {
      if (data[key] == null || data[key] == 'null') {
        data[key] = '';//jw 2016.09.14 数值为空时，传成空字符串，以免转换json后，后台解析时要处理"null"这种不合理的字符串。不能删除key(delete data[key])，因为后台getString时会报错
      }
      if (key == 'files') {
        var files = data[key].files;
        for (var i = 0; i < files.length; i++) {
          formData.append(key, files[i]);//例：formData.append("file", document.getElementById('fileName').files[0]);
        }
      } else {
        formData.append(key, data[key]);//例：formData.append("file", document.getElementById('fileName').files[0]);
      }
    }
    tempConfig = {
      data: formData,
      contentType: false, // 告诉jQuery不要去设置Content-Type请求头
      processData: false, // 告诉jQuery不要去处理发送的数据
      cache: false
    };
    uinv.hash.combine(ajaxConfig, tempConfig);
  } else {
    if (data && typeof data == 'object') {
      for (var key in data) {
        if (data[key] == null || data[key] == 'null') {
          data[key] = '';//jw 2016.09.14 数值为空时，传成空字符串，以免转换json后，后台解析时要处理"null"这种不合理的字符串。不能删除key(delete data[key])，因为后台getString时会报错
        }
      }
      if (ajaxCache && uinv.curSceneResId && !data['scId']) {
        data['scId'] = uinv.curSceneResId;
      }
      data = JSON.stringify(data);
    }
    tempConfig = {
      data: data
    };
    if (type.toUpperCase() == 'POST') { //jw 2017.04.28 后台修改后，格式约定为json
      tempConfig.contentType = config.contentType === undefined ? 'application/json; charset=utf-8' : config.contentType;
    }
    uinv.hash.combine(ajaxConfig, tempConfig);
  }

  ajaxFun(ajaxConfig);
  if (!async) {
    return back;
  }
  return deferred.promise;
};

/**
 * 获取config中缓存配置项
 * @private
 */
uinv.util.getAjaxCache = function (config) {
  return config.ajaxCache === undefined ? uinv.ajaxCache : config.ajaxCache;
};

/**
 * 为属性解析路径
 * @param {String} name 需要解析的路径
 * @return {Array} 解析后的路径
 * @example uinv.util._parsePathForAttribute(path);
 */
uinv.util._parsePathForAttribute = function (name) {
  if (typeof name === 'string') {
    if (name.indexOf('/') != -1) {
      name = name.split('/');
    } else if (name.indexOf('\\') != -1) {
      name = name.split('\\');
    }
    if (typeof name == 'string') {
      return [name];
    }
    return name;
  }
  return name;
};

/**
 * 获取属性
 * @param {Object} obj 对象
 * @param {String} path 路径
 * @return {Object} 属性值
 */
uinv.util.getAttribute = function (obj, path) {
  path = uinv.util._parsePathForAttribute(path);
  for (var i = 0; i < path.length; i++) {
    if (!obj) return undefined;
    obj = obj[path[i]];
  }
  return obj;
};

/**
 * 设置属性
 * @param {Object} obj 对象
 * @param {String} path 路径
 * @param {String} value 设置的属性值
 */
uinv.util.setAttribute = function (obj, path, value) {
  path = uinv.util._parsePathForAttribute(path);
  for (var i = 0; i < path.length - 1; i++) {
    var cur = path[i];
    if (!obj[cur]) obj[cur] = {};
    obj = obj[cur];
  }
  obj[path[path.length - 1]] = value;
};

/**
 * 删除属性
 * @param {Object} obj
 * @param {Object} path
 */
uinv.util.delAttribute = function (obj, path) {
  path = uinv.util._parsePathForAttribute(path);
  for (var i = 0; i < path.length - 1; i++) {
    var cur = path[i];
    if (!obj[cur]) obj[cur] = {};
    obj = obj[cur];
  }
  delete obj[path[path.length - 1]];
};

//////////////////////////////////////////////////////////////////////////////////
/**
 * @param {string} opFilename
 * @return {string}
 */
uinv.util.filenameFromPath = function (opFilename) {
  opFilename = opFilename.replaceAll('/', '\\');
  var pos = opFilename.lastIndexOf('\\');
  if (pos == -1) {
    return opFilename;
  }
  return opFilename.substring(pos + 1, opFilename.length);
};
//////////////////////////////////////////////////////////////////////////////////
/**
 * @param {string} opFilename
 * @return {string}
 */
uinv.util.getFilenamePath = function (opFilename) {
  var pos = opFilename.lastIndexOf('\\');
  if (pos == -1) {
    pos = opFilename.lastIndexOf('/');
  }
  if (pos == -1) {
    return opFilename;
  }
  return opFilename.substring(0, pos + 1);
};
//////////////////////////////////////////////////////////////////////////////////
/**
 * @param {string} opFilename
 * @return {string}
 */
uinv.util.getFilenameFile = function (opFilename) {
  var filename = uinv.util.filenameFromPath(opFilename);
  var pos = filename.lastIndexOf('.');
  if (pos == -1) {
    return filename;
  }
  return filename.substring(0, pos);
};
//////////////////////////////////////////////////////////////////////////////////
/**
 * @param {string} opFilename
 * @return {string}
 */
uinv.util.getFilenameType = function (opFilename) {
  var pos = opFilename.lastIndexOf('.');
  if (pos == -1) {
    return '';
  }
  return opFilename.substring(pos, opFilename.length);
};

/* *****************************************************************************
 *
 * 数组辅助工具
 *
 */

/**
 * 在数组中去除重复项
 * @param {Array} results 原始数组
 * @param {Boolean} keepFirst boolean，是否保留第一个重复值
 * @return {Array} 删除了重复项的数组
 * @example uinv.util.unique(result);
 */
uinv.util.unique = function (results, keepFirst) {
  var delList = [];

  for (var i = 0; i < results.length; i++) {
    for (var ii = i + 1; ii < results.length; ii++) {
      if (results[i] == results[ii]) {
        if (keepFirst) uinv.util.addNewItemToArray(ii, delList);
        else uinv.util.addNewItemToArray(i, delList);
      }
    }
  }

  uinv.util.delItemsByIndexArray(results, delList);
  return results;
};

/**
 * 清空数组
 * @param {Array} opArray  对象数组
 * @return {Array}  返回为空的数组
 */
uinv.util.clearArray = function (opArray) {
  opArray.splice(0, opArray.length);
  return opArray;
};
/**
 * 在数组中找到指定元素的位置(以0开始)
 * @param {Array} opArray  对象数组
 * @param {String} opValue  要查找值
 * @return {String}  返回位置，未找到返回-1
 */
uinv.util.findItemInArray = function (opArray, opValue) {
  for (var i = 0; i < opArray.length; i++) {
    if (opArray[i] == opValue) {
      return i;
    }
  }
  return -1;
};

/**
 * 判断元素是否在数组中
 * @param {String} opValue
 * @param {Array} opArray
 * @return {Boolean}
 */
uinv.util.isInArray = function (opValue, opArray) {
  return this.findItemInArray(opArray, opValue) != -1;
};

/**
 * 清空数组中空元素
 * @param {Array} opArray
 * @return {Array}
 */
uinv.util.clearEmptyItemInArray = function (opArray) {
  for (var i = 0; i < opArray.length; i++) {
    if (typeof opArray[i] === 'undefined' || opArray[i] == '') {
      opArray.splice(i, 1);
      i -= 1;
    }
  }
  return opArray;
};

/**
 * 在数组末尾添加元素 如果有,则返回位置;如果是新添加,则返回新数组长度
 * @param {String} opValue 要添加的元素
 * @param {Array} opArray 对象数组
 * @return {String}  数组中有该元素则返回该元素的位置，否则返回新数组长度
 */
uinv.util.addNewItemToArray = function (opValue, opArray) {
  for (var i = 0; i < opArray.length; i++) {
    if (opArray[i] == opValue) {
      return i;
    }
  }
  opArray.push(opValue);
  return opArray.length;
};

/**
 * 向数组中插入元素
 * @param {String} opValue  插入的元素
 * @param {Array} opArray  插入的对象数组
 * @param {String} index    插入的位置
 * @return {Array} 新数组
 */
uinv.util.insertItemToArray = function (opValue, opArray, index) {
  opArray.splice(index, 0, opValue);
  return opArray;
};

/**
 * 获取两个数组中相同的元素
 * @param {Array} opArrayA 数组1
 * @param {Array} opArrayB 数组2
 * @return {String}  数组中相同的元素
 */
uinv.util.getConcomitanceBetweenArrays = function (opArrayA, opArrayB) {
  var result = [];
  for (var i = 0; i < opArrayA.length; i++) {
    var itemA = opArrayA[i];
    if (uinv.util.findItemInArray(opArrayB, itemA) != -1) {
      uinv.util.addNewItemToArray(itemA, result);
    }
  }
  return result;
};

//array 有 concat 的方法,但不能直接将源数据改变
/**
 * 链接两个数组 把两个数组合成一个数组,相同元素会分别保留,两个必须是数组,不能一个数组一个字符串
 * @param {Array} opArrayA  数组1
 * @param {Array} opArrayB  数组2
 * @param {Boolean} returnNew  是否返回新数组
 * @return {Array} 新数组
 */
uinv.util.mergeArrays = function (opArrayA, opArrayB, returnNew) {
  if (returnNew) {
    return opArrayA.concat(opArrayB);
  }

  for (var i = 0; i < opArrayB.length; i++) {
    opArrayA.push(opArrayB[i]);
  }
  return opArrayA;
};

/**
 * 往数组A中合并入数B，有则不插入，返回长大的A。此举不会去除A中重复元素
 * @author jw
 * @date 2017-07-19
 */
uinv.util.concatArrays = function (opArrayA, opArrayB) {
  for (var i = 0; i < opArrayB.length; i++) {
    if (opArrayA.indexOf(opArrayB[i]) == -1) {
      opArrayA.push(opArrayB[i]);
    }
  }
  return opArrayA;
};

/**
 * 消减数组,从A中去除与B重复的元素
 * @param {Array} opArrayA  原始数组
 * @param {Array} opArrayB  校样数组
 * @return {Boolean} 返回新数组
 */
uinv.util.subtractArrays = function (opArrayA, opArrayB) {
  var result = [];
  for (var i = 0; i < opArrayA.length; i++) {
    var itemA = opArrayA[i];
    if (uinv.util.findItemInArray(opArrayB, itemA) == -1) {
      uinv.util.addNewItemToArray(itemA, result);
    }
  }
  return result;
};

//////////////////////////////////////////////////////////////////////////////////
/**
 * 数组排序,升序
 * @param {Array} a
 * @param {Array} b
 * @return {Array}
 */
uinv.util._ArraySort_Up = function (a, b) {
  return a - b;
};
/**
 * 数组排序,降序
 * @param {Array} a
 * @param {Array} b
 * @return {Array}
 */
uinv.util._ArraySort_Down = function (a, b) {
  return b - a;
};
/**
 * 根据位置序列删除数组元素
 * @param {Array} opA 数组
 * @param {Array} opIA 序列数组
 */
uinv.util.delItemsByIndexArray = function (opA, opIA) {
  opIA.sort(uinv.util._ArraySort_Down);
  for (var i = 0; i < opIA.length; i++) {
    opA.splice(opIA[i], 1);
  }
};

/**
 * 从数组中删除指定元素,如果指定元素有多个,也只是删除最前面的一个
 * @param {Array} opA  对象数组
 * @param {String} opItem  要删除的元素
 */
uinv.util.delFirstItemFromArray = function (opA, opItem) {
  var pos = uinv.util.findItemInArray(opA, opItem);
  if (pos != -1) {
    opA.splice(pos, 1);
  }
};

/**
 * 根据key值，从数组中取出对应的数组
 * @param {Array} opA 源数组
 * @param {String} key 要取的键值
 * @return {Array} [XX,XX]
 * @author jw
 * @date 2017-07-07
 */
uinv.util.getItemsFromArrayByKey = function (opA, key) {
  if (!(opA instanceof Array)) opA = [opA];
  var values = [];
  opA.map(function (obj) {
    if (obj && obj[key]) {
      values.push(obj[key]);
    }
  });
  return values;
};

/**
 * 根据keys值，从数组中取出对应的数组
 * @param {Array} opA 源数组
 * @param {Array} keys 要取的键值数组
 * @param {Boolean} isAllowNull 是否允许值为空，默认不允许
 * @return {Array} [{key1:XX,key2:XX},{key1:XX,key2:XX}]
 * @author jw
 * @date 2017-07-07
 */
uinv.util.getItemsFromArrayByKeys = function (opA, keys, isAllowNull) {
  if (!(opA instanceof Array)) opA = [opA];
  if (!(keys instanceof Array)) keys = [keys];
  var values = [];
  opA.map(function (obj) {
    var value = {};
    keys.map(function (key) {
      if (obj && key) {
        if (isAllowNull) {
          value[key] = obj[key];
        } else {
          if (obj[key]) {
            value[key] = obj[key];
          }
        }
      }
    });
    values.push(value);
  });
  return values;
};

/**
 * 根据keys值，从object中取出对应的数组
 * @param {Object} obj 源对象
 * @param {Array|String} keys 要取的键值数组或者字符串
 * @param {Boolean} isFilterNull 是否过滤空值，默认不允许，仅取数组时有效
 * @return {Array} [{key1:XX,key2:XX},{key1:XX,key2:XX}]
 * @author jw
 * @date 2017-07-07
 */
uinv.util.getAttrsFromObjectByKeys = function (obj, keys, isFilterNull) {
  if (!(keys instanceof Array)) {
    if (obj && keys) {
      return obj[keys];
    }
  } else {
    var values = [];
    var value = {};
    keys.map(function (key) {
      if (obj && key) {
        if (!isFilterNull) {
          value[key] = obj[key];
        } else {
          if (obj[key]) {
            value[key] = obj[key];
          }
        }
      }
    });
    values.push(value);
    return values;
  }
};

//////////////////////////////////////////////////////////////////////////////////
uinv._chineseChars = '123456789ABCDE';
/**
 * 根据汉字字符进行排序
 * @param {Array} opA  要排序的数组
 * @param {Object} param
 * @return {Array}  排序后的数组
 * @example uinv.util.sortArrayByChar(keys);
 */
uinv.util.sortArrayByChar = function (opA, param) {
  return opA.sort(function (c1, c2) {
    var a;
    var b;
    if (param && param['useAttribute']) {
      a = ('' + uinv.util.getAttribute(c1, param['useAttribute'])).split('');
      b = ('' + uinv.util.getAttribute(c2, param['useAttribute'])).split('');
    } else {
      a = ('' + c1).split('');
      b = ('' + c2).split('');
    }

    for (var i = 0; i < a.length; i++) {
      if (b[i] === undefined) return 1;
      if (a[i] == b[i]) continue;

      var indexa = uinv._chineseChars.indexOf(a[i]);
      var indexb = uinv._chineseChars.indexOf(b[i]);
      if (indexa == -1 && indexb == -1) {
        if (a[i] > b[i]) return 1;
        return -1;
      }

      if (indexa != -1 && indexb == -1) return 1;
      if (indexa == -1 && indexb != -1) return -1;
      if (indexa > indexb) return 1;
    }
    return -1;
  });
};
/**
 * 数组排序,根据数字
 * @param {Array} opA  要排序的数组
 * @param {Object} param 排序的条件
 * @return {Array}    排序后的数组
 */
uinv.util.sortArrayByNumber = function (opA, param) {
  return opA.sort(function (c1, c2) {
    if (param && param['useAttribute']) {
      c1 = c1[param['useAttribute']];
      c2 = c2[param['useAttribute']];
    }
    if (param && param['dir'] == 'descending') {
      if (c1 < c2) return 1;
      return -1;
    }
    if (c2 < c1) return 1;
    return -1;
  });
};

/**
 * 是否数字，不带小数点
 */
uinv.util.isNum = function (num) {
  var reNum = /^\d*$/;
  return num !== '' && reNum.test(num);
};

/* *****************************************************************************
 *
 * UUID
 *
 */

/**
 * 创建唯一识别码 (Universally Unique Identifier)
 * @return {String}
 */
uinv.util.createUUID = function () {
  var dg = new Date(1582, 10, 15, 0, 0, 0, 0);
  var dc = new Date();
  var t = dc.getTime() - dg.getTime();
  var tl = uinv.util._UUID_getIntegerBits(t, 0, 31);
  var tm = uinv.util._UUID_getIntegerBits(t, 32, 47);
  var thv = uinv.util._UUID_getIntegerBits(t, 48, 59) + '1'; // version 1, security version is 2
  var csar = uinv.util._UUID_getIntegerBits(uinv.util._UUID_rand(4095), 0, 7);
  var csl = uinv.util._UUID_getIntegerBits(uinv.util._UUID_rand(4095), 0, 7);

  var n = uinv.util._UUID_getIntegerBits(uinv.util._UUID_rand(8191), 0, 7)
    + uinv.util._UUID_getIntegerBits(uinv.util._UUID_rand(8191), 8, 15)
    + uinv.util._UUID_getIntegerBits(uinv.util._UUID_rand(8191), 0, 7)
    + uinv.util._UUID_getIntegerBits(uinv.util._UUID_rand(8191), 8, 15)
    + uinv.util._UUID_getIntegerBits(uinv.util._UUID_rand(8191), 0, 15); // this last number is two octets long
  return tl + tm + thv + csar + csl + n;
};
/**
 * UUID整数节点
 * @param {String} val  源
 * @param {Number} start 起点
 * @param {Number} end   终点
 * @return {String}    截取后的字符串
 */
uinv.util._UUID_getIntegerBits = function (val, start, end) {
  var base16 = uinv.util._UUID_returnBase(val, 16);
  var quadArray = [];
  var quadString = '';
  var i = 0;
  for (i = 0; i < base16.length; i++) {
    quadArray.push(base16.substring(i, i + 1));
  }
  for (i = Math.floor(start / 4); i <= Math.floor(end / 4); i++) {
    if (!quadArray[i] || quadArray[i] == '') quadString += '0';
    else quadString += quadArray[i];
  }
  return quadString;
};
/**
 * 把十进制数字转成16进制的数字
 * @param {Number} number 十进制数字
 * @param {} base
 * @return {String}
 */
uinv.util._UUID_returnBase = function (number, base) {
  return (number).toString(base).toUpperCase();
};
/**
 * 返回随机近似整数值
 * @param {Number} max
 * @return {Number}
 */
uinv.util._UUID_rand = function (max) {
  return Math.floor(uinv.random() * (max + 1));
};

//////////////////////////////////////////////
/**
 * 把 Number 四舍五入为指定小数位数的数字
 * @param {Number} num    数字
 * @param {Number} toFixed  位数
 * @param {Boolean} force 是否所有数都保留位数，即整数3转换后为3.00之类
 * @return {Number}  四舍五入后的数字
 */
uinv.util.toFixed = function (num, toFixed, force) {
  if (force) {
    return num.toFixed(toFixed);
  }
  var str = num.toString();
  var pos = str.indexOf('.');
  if (pos == -1) return str;
  if (str.length > pos + toFixed + 1) {
    return num.toFixed(toFixed);
  }
  return str;
};

//////////////////////////////////////////////
/**
 * 把RGB值转为系统使用的格式[255,0,0]转成[1,0,0] 保留3为小数
 * @param {Array} input
 * @param {Number} colorSystem
 * @return {Array}
 */
uinv.util.normalizeColor = function (input, colorSystem) {
  if (typeof input == 'string') {
    if (input.indexOf(' ') != -1) input = input.split(' ');
    else if (input.indexOf(',') != -1) input = input.split(',');
  }

  var result = [input[0], input[1], input[2], input[3]];

  if (colorSystem === undefined) {
    if (input[0] <= 1 && input[1] <= 1 && input[2] <= 1) colorSystem = 1;
  }

  if (colorSystem != 1) {
    result[0] = (result[0] / 255).toFixed(3);
    result[1] = (result[1] / 255).toFixed(3);
    result[2] = (result[2] / 255).toFixed(3);
    if (result[3] !== undefined) result[3] = (result[3] / 255).toFixed(3);
  }
  if (result[3] === undefined) result[3] = 1;

  return result;
};

//colorSystem 为 1 :"0.1 0.1 0.1" ; colorSystem 为255 :"232 32 34"
/**
 * 解析网页颜色
 * @param {Array} input
 * @param {Number} colorSystem
 * @return {Array}
 */
uinv.util.parseWebColor = function (input, colorSystem) {
  if (typeof input == 'string') {
    if (input.indexOf(' ') != -1) input = input.split(' ');
    else if (input.indexOf(',') != -1) input = input.split(',');
  }
  if (colorSystem === undefined) {
    if (input[0] <= 1 && input[1] <= 1 && input[2] <= 1) colorSystem = 1;
  }

  var tmp = [input[0], input[1], input[2]];
  if (colorSystem == 1) {
    tmp[0] = Math.round(tmp[0] * 255);
    tmp[1] = Math.round(tmp[1] * 255);
    tmp[2] = Math.round(tmp[2] * 255);
  }
  var result = '#';
  for (var i = 0; i < tmp.length; i++) {
    var n = Number(tmp[i]).toString(16);
    var Numbern = Number(n);
    if (isNaN(Numbern)) {
      if (n.length == 1) { //有可能是a,b,c,d,e,f需要补0
        n = '0' + n;
      }
    } else {
      if (Numbern < 10) { //小于10时补0
        n = '0' + n;
      }
    }
    result += n;
  }
  return result;
};
/**
 * 解析16进制网页颜色转换为RGB值
 * @param {Array} input "#00538b"
 *
 * @return {Array}
 */
uinv.util.toHexString = function (input) {
  if (typeof input == 'string') {
    var color = input.split('#');
    color = color[1];
    var layerColor = [0, 0, 0];
    layerColor[0] = parseInt(color.substr(0, 2), 16) / 255;
    layerColor[1] = parseInt(color.substr(2, 2), 16) / 255;
    layerColor[2] = parseInt(color.substr(4, 2), 16) / 255;
    return layerColor;
  }
  return [0, 0, 0];
};

/**
 * 过滤特殊字符串并清除空格
 * @param {} characters
 */
uinv.util.delSpaceCharacter = function (characters) {
  var pattern = new RegExp('[`~!@#$^&*()=|{}\':;\',\\[\\].<>/?~！@#￥……&*（）%％|【】‘；：”“\'。，、？-]');
  var rs = '';
  for (var i = 0; i < characters.length; i++) {
    rs = rs + characters.substr(i, 1).replace(pattern, '');
  }
  rs = rs.replace('\\', '');
  rs = rs.replace(/\s/gi, '');
  return rs;
};

/**
 * 特殊符号过滤, 允许输入一般标点符号
 * @param {string} s
 * @param {boolean} isOutSpace 是否忽略空格
 * @return {}
 */
uinv.util.replaceMark = function (s, isOutSpace) {
  // var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）%％|【】‘；：”“'。，、？]");
  var pattern = new RegExp('[`~^*=|{}<>￥……*|‘”“\']');
  var rs = '';
  for (var i = 0; i < s.length; i++) {
    rs = rs + s.substr(i, 1).replace(pattern, '');
    rs = rs.replace('-', '');
    // rs = rs.replace('\\', '');
    if (!isOutSpace) {
      rs = rs.replace(' ', '');
    }
  }
  return rs;
};

/**
 * 测试是否包含特殊字符（其中不包含单引号，因为win10微软输入法输入词语时，会有单引号）
 * @author jw
 * @date 2016-11-29
 * @return {boolean} 是，返回true
 */
uinv.util.testMark = function (s) {
  var pattern = new RegExp('[`~^*|{}<>￥……*|‘”“]');
  // var pattern = new RegExp("[`~!@#$^&*()=|{}:;,\\[\\].<>/?~！@#￥……&*（）%％|【】‘；：”“。，、？]");
  return pattern.test(s);
};

/**
 * 删除所有空格和单引号
 * @author jw
 * @date 2016-11-24
 */
uinv.util.delSpace = function (s) {
  s = s.replace(/\s/gi, '');
  s = s.replace(/'/gi, '');
  s = s.replace(/"/gi, '');
  return s;
};

/**
 * 翻译Obj的key、value
 * @param {Object} obj
 * @param {String} transWhere = [key|value|all] 翻译哪一部分
 * @param {Object} transKeyObj 翻译时要从transKeyObj中读取，为空时，会调用u.le.get()
 * @param {Object} transValueObj 当且仅当transWhere='all'时，value的翻译对象为transKeyObj，为空时，会调用u.le.get()
 * @example
 *        var obj = {	'independentDevice':'CLASSID_DEVICE',
 *                  	'cabinet':'CLASSID_CABINET'
 *                  	};
 *        uinv.util.translateObj(obj,'all',uinv.keyWorldForDCV,uinv);
 * @author jw
 * @date 2016-12-17
 */
uinv.util.translateObj = function (obj, transWhere, transKeyObj, transValueObj) {
  if (!transWhere) {
    transWhere = 'value';
  }
  var transFun = function (key, transObj) {
    if (transObj) {
      return transObj[key] || key;
    }
    return u.le.get(key);
  };
  var getValFun = function (key, transObj) {
    if (typeof key === 'string' && (key.indexOf('productInfo/') == 0 || key.indexOf('DATA/') == 0)) {
      var tempArr = key.split('/');
      key = tempArr[0];
      for (var i = 1; i < tempArr.length; i++) {
        key += '/' + transFun(tempArr[i], transObj);
      }
    } else {
      key = transFun(key, transObj);
    }
    return key;
  };

  for (var key in obj) {
    var value = obj[key];
    if (transWhere == 'key') {
      delete obj[key];
      key = getValFun(key, transKeyObj);
      obj[key] = value;
    } else if (transWhere == 'value') {
      obj[key] = getValFun(value, transKeyObj);
    } else { // 'all'
      delete obj[key];
      key = getValFun(key, transKeyObj);
      value = getValFun(value, transValueObj);
      obj[key] = value;
    }
  }
  return obj;
};

/**
 * 全局调用：过滤信息
 * @param result 要处理的结果
 * @param {Boolean} noprompt 错误时，是否要弹出提示，默认为false，会弹
 * @param {Function} failCB 失败处理的函数
 */
uinv.util.operateRemoteResult = function (result, noprompt, failCB) {
  //2014.09 result新的标准是字符串
  if (typeof result === 'string') {
    result = uinv.jsonParse(result);
  }
  if (!result) {
    //      if(!noprompt) alert ( u.le.get( "返回未得到数据") );
    //      if(failCB) failCB(u.le.get( "返回未得到数据"));
  } else if (result['success']) {
    if (result['data'] === '' || result['data'] === undefined) {
      return true;
    }
    return uinv.jsonParse(result['data']);
  } else if (result['success'] == false) {
    // if (result["data"] == "The license has expired_3") {
    //   uinv.util.alert("DCV_THE_LICENSE_HAS_EXPIRED");
    //   uinv.toLicense();
    //   return;
    // }
    if (!noprompt) {
      var msg = result['message'] || uinv.stringify(result);
      if (msg.indexOf('Sorry, you do not have the permission of [{0}]') != -1) { //jw 2016.11.23 "对不起，您没有[{0}]的权限！" 这种情况，只提示即可
        uinv.util.alert(result['message']);
      } else if (uinv.util.confirm(['DCV_ERROR_WHILE_MAKE_SERVER_REQUEST_0_DEBUG_AT_THE_ERROR_POINT', msg])) { //jw 2016.11.22 后台返回错误，只需要用翻译后的message即可
        stopJs[0] = 0;
        // debugger;
      }
    }
    if (failCB) {
      failCB(result['data']);
    }
  }
  return null;
};

/**
 * @description base64加密
 * @param {String} str 字符串
 *
 */
uinv.util.base64Encode = function (str) {
  var base64EncodeChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  var out, i, len;
  var c1, c2, c3;

  len = str.length;
  i = 0;
  out = '';
  while (i < len) {
    c1 = str.charCodeAt(i++) & 0xff;
    if (i == len) {
      out += base64EncodeChars.charAt(c1 >> 2);
      out += base64EncodeChars.charAt((c1 & 0x3) << 4);
      out += '==';
      break;
    }
    c2 = str.charCodeAt(i++);
    if (i == len) {
      out += base64EncodeChars.charAt(c1 >> 2);
      out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
      out += base64EncodeChars.charAt((c2 & 0xF) << 2);
      out += '=';
      break;
    }
    c3 = str.charCodeAt(i++);
    out += base64EncodeChars.charAt(c1 >> 2);
    out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
    out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
    out += base64EncodeChars.charAt(c3 & 0x3F);
  }
  return out;
};

/**
 * 将字符串转成数组
 * @param {String} str 字符串
 * @param {String} quote 逗号分隔符
 * @author jw
 * @date 2017-06-06
 * @return {Array}
 */
uinv.util.str2Arr = function (str, quote) {
  if (typeof str !== 'string') {
    return str;
  }
  quote = quote || ',';
  if (str.indexOf(quote) != -1) {
    if (str.startsWith('[') && str.endsWith(']')) {
      str = str.substr(1, -1);
    }
    str = str.split(quote);
  } else {
    str = [str];
  }
  return str;
};

/**
 * 判断字符串的开头字符，如果以判断的值开头则返回true
 * @param {} str    目标字符串
 * @param {} startStr  开头字符
 */
uinv.util.stringStartWith = function (str, startStr) {
  var reg = new RegExp('^' + startStr);
  return reg.test(str);
};

/**
 * 判断字符串的结束字符，如果以判断的值结尾则返回true
 * @param {} str    目标字符串
 * @param {} startStr  结束字符
 */
uinv.util.stringEndWith = function (str, endStr) {
  var reg = new RegExp(endStr + '$');
  return reg.test(str);
};

/**
 * 平铺数组中数组
 * @param {Array} arr 数组
 * @return {Array}
 */
uinv.util.flatten = function flatten (arr) {
  return arr.reduce(function (a, b) {
    return a.concat(Array.isArray(b) ? flatten(b) : b);
  }, []);
};

/**
 * dataURL(base64字符串)转换为Blob对象（二进制大对象）
 * @param {String} dataUrl base64字符串
 * @return {Blob}
 */
uinv.util.dataURLtoBlob = function (dataUrl) {
  var arr = dataUrl.split(',');
  var mime = arr[0].match(/:(.*?);/)[1];// 结果：   image/png
  // console.log("arr[0]====" + JSON.stringify(arr[0]));//   "data:image/png;base64"
  // console.log("arr[0].match(/:(.*?);/)====" + arr[0].match(/:(.*?);/));// :image/png;,image/png
  // console.log("arr[0].match(/:(.*?);/)[1]====" + arr[0].match(/:(.*?);/)[1]);//   image/png
  var bstr = atob(arr[1].replace(/\s/g, ''));
  var n = bstr.length;
  var u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], {type: mime});//值，类型
};

/* *****************************************************************************
 *
 * hash 散列
 *
 */

uinv.hash = {};
/**
 * 获取对象中元素数目
 * @param {Object} opObject
 * @return {Number}
 */
uinv.hash.getSize = function (opObject) {
  var result = 0;
  for (var cur in opObject) {
    result += 1;
  }
  return result;
};
/**
 * 查看对象是否包含元素
 * @param {Object} opObject
 * @return {Boolean}
 */
uinv.hash.isEmpty = function (opObject) {
  for (var cur in opObject) {
    return false;
  }
  return true;
};
/**
 * 查看对象中是否包含指定名称的元素
 * @param {Object} opObject
 * @param {String} key
 * @return {Boolean}
 */
uinv.hash.hasKey = function (opObject, key) {
  // return typeof opObject[key] != 'undefined';
  if (opObject != null) {
    return opObject.hasOwnProperty(key);
  }
  uinv.util.alert('传入opObject参数有误');
  return false;
};
/**
 * 重新命名对象元素
 * @param {Object} opObject
 * @param {String} oldKey
 * @param {String} newKey
 */
uinv.hash.renameKey = function (opObject, oldKey, newKey) {
  if (opObject[oldKey]) {
    var tmp = opObject[oldKey];
    delete opObject[oldKey];
    opObject[newKey] = tmp;
  }
};
/**
 * 获取第一个元素的名称
 * @param {Object} opObject
 * @return {String}
 */
uinv.hash.getFirstKey = function (opObject) {
  for (var i in opObject) {
    return i;
  }
  return null;
};
/**
 * 获取对象所有元素的名称
 * @param {Object} opObject
 * @return {Array}
 */
uinv.hash.keys = function (opObject) {
  var keys = [];
  for (var i in opObject) {
    keys.push(i);
  }
  return keys;
};
/**
 * 获取对象中第一个元素的值
 * @param {Object} opObject
 * @return {String}
 */
uinv.hash.getFirstValue = function (opObject) {
  for (var i in opObject) {
    return opObject[i];
  }
  return undefined;
};
/**
 * 获取对象中所有元素的值
 * @param {Object} opObject
 * @return {Array}
 */
uinv.hash.values = function (opObject) {
  if (opObject instanceof Array) return opObject;//数组无需转换,ie8里遍历数组会把数组原型链扩展方法当做一个属性输出
  var values = [];
  for (var i in opObject) {
    values.push(opObject[i]);
  }
  return values;
};

/**
 * 清除对象中的元素
 * @param {Object} opObject
 */
uinv.hash.clear = function (opObject) {
  for (var key in opObject) {
    delete opObject[key];
  }
};

/**
 * 合并对象 A中与B相同名称的元素会被替换成B中的值 返回长大了的A
 * @param {Object} opObjectA
 * @param {Object} opObjectB
 * @param {Boolean} isDeep
 * @param {Boolean} isReturnNew
 * @param {Boolean} isCloneObjDeep
 * @return {Object}
 */
uinv.hash.combine = (function () {
  var fun = function (opObjectA, opObjectB, isDeep, isReturnNew, isCloneObjDeep) {
    if (isReturnNew) {
      var tempFun = uinv.util.cloneObj || uinv.cloneObj;
      var result = tempFun(opObjectA, isCloneObjDeep);
      fun(result, opObjectB, isDeep, false);
      return result;
    }
    for (var cur in opObjectB) {
      if (isDeep) {
        if (opObjectA[cur] !== undefined && opObjectA[cur] !== null
          && !(opObjectA[cur] instanceof Array) && typeof opObjectA[cur] == 'object'
          && !(opObjectB[cur] instanceof Array) && typeof opObjectB[cur] == 'object') {
          fun(opObjectA[cur], opObjectB[cur], isDeep, false);
        } else {
          opObjectA[cur] = opObjectB[cur];
        }
      } else {
        opObjectA[cur] = opObjectB[cur];
      }
    }
    return opObjectA;
  };
  return fun;
})();

/**
 * 合并对象 只会在A的基础上添加元素,不影响原有元素 返回长大了的A
 * @param {Object} opObjectA
 * @param {Object} opObjectB
 * @param {Boolean} isDeep
 * @param {Boolean} isReturnNew
 * @param {Boolean} isCloneObjDeep
 * @return {Object}
 */
uinv.hash.combineNew = (function () {
  var fun = function (opObjectA, opObjectB, isDeep, isReturnNew, isCloneObjDeep) {
    if (isReturnNew) {
      var tempFun = uinv.util.cloneObj || uinv.cloneObj;
      var result = tempFun(opObjectA, isCloneObjDeep);
      fun(result, opObjectB, isDeep, false);
      return result;
    }
    for (var cur in opObjectB) {
      if (isDeep) {
        if (opObjectA[cur] !== undefined && opObjectA[cur] !== null
          && !(opObjectA[cur] instanceof Array) && typeof opObjectA[cur] == 'object'
          && !(opObjectB[cur] instanceof Array) && typeof opObjectB[cur] == 'object') {
          fun(opObjectA[cur], opObjectB[cur], isDeep, false);
        } else {
          if (opObjectA[cur] === undefined || opObjectA[cur] === null) opObjectA[cur] = opObjectB[cur];
        }
      } else {
        if (opObjectA[cur] === undefined || opObjectA[cur] === null) opObjectA[cur] = opObjectB[cur];
      }
    }
    return opObjectA;
  };
  return fun;
})();

/**
 * 消减对象 消减A与B中相同的元素 返回被消减的A
 * @param {Object} opObjectA
 * @param {Object} opObjectB
 * @param {Boolean} isReturnNew
 * @return {Object}
 */
uinv.hash.subtract = function (opObjectA, opObjectB, isReturnNew) {
  if (isReturnNew === undefined) isReturnNew = true;
  if (isReturnNew) {
    var result = {};
    for (var cur in opObjectA) {
      if (!opObjectB || !opObjectB[cur]) result[cur] = opObjectA[cur];
    }
    return result;
  }
  for (var cur2 in opObjectB) {
    delete opObjectA[cur2];
  }
  return opObjectA;
};
/**
 * 获取交叉值 以A为标准,返回A中与B相同元素组成的对象
 * @param {Object} opObjectA
 * @param {Object} opObjectB
 * @param {Boolean} keepValueSame
 * @return {Object}
 */
uinv.hash.getIntersection = function (opObjectA, opObjectB, keepValueSame) {
  var result = {};
  for (var cur in opObjectA) {
    if (opObjectB[cur]) {
      if (keepValueSame) {
        if (opObjectA[cur] == opObjectB[cur]) result[cur] = opObjectA[cur];
      } else {
        result[cur] = opObjectA[cur];
      }
    }
  }
  return result;
};

///////////////////userver///////////////////////////////////////////
/**
 * 封装后台所有接口
 * @author PKG
 * @date 2013-12-20
 */
/**
 * 用于封装后台接口的命名空间
 */
userver = window.userver || {};

/**
 * 全局调用：debug模式：默认关闭
 */
userver._debugMode = true;

/**
 * 全局调用：debug模式开关
 */
userver.setDebugMode = function (bool) {
  userver._debugMode = bool;
};

/**
 * 全局调用：过滤信息
 * @param result 要处理的结果
 * @param {Boolean} noprompt 错误时，是否要弹出提示，默认为false，会弹
 * @param {Function} failCB 失败处理的函数
 */
userver.operateRemoteResult = uinv.util.operateRemoteResult;

/**
 * 获取场景id
 */
userver.getSceneId = function () {
  var scID;
  if (!uinv.isUseNode || !uinv.isInNode()) {
    scID = uinv.util.getURLParams('ID');
  }
  if (!scID) {
    scID = uinv.server.manager.data.queryInitGisCurrentHis(); //jw 2017.06.15 先看有没有要求预加载的场景，如果没有，则默认取场景列表中第一个
    if (!scID || scID == '') {
      var arrScenc = uinv.server.manager.data.getAllSceneNameAndId();
      if (arrScenc && arrScenc.length > 0) {
        scID = arrScenc[0]['scId'];
      }
    }
  }
  return scID;
};

/**
 * 全局调用：封装后台接口，过滤掉后台回传的冗余信息
 */
userver.operateRemoteInterface = function (iface, param, otherParam) {
  if (param && !(param instanceof Array)) {
    param = [param];
  }
  if (!otherParam) {
    otherParam = {};
  }
  var getSceneId = function () {
    var scID;
    if (uinv.curSceneResId) {
      scID = uinv.curSceneResId;
    } else {
      scID = userver.getSceneId();
    }
    return scID || '0';
  };

  //如果是异步
  if (typeof param[param.length - 1] == 'function') {
    if (!otherParam['doItSelf']) {
      var funcTmp = param[param.length - 1];
      var func;
      if (userver._debugMode) {
        func = function (back) {
          setTimeout(function () {
            back = userver.operateRemoteResult(back, otherParam['noprompt'], otherParam['failCB']);
            funcTmp(back);
          }, 1);
        };
      } else {
        func = function (back) {
          back = userver.operateRemoteResult(back, otherParam['noprompt'], otherParam['failCB']);
          funcTmp(back);
        };
      }
      param[param.length - 1] = func;
    }

    if (!otherParam['dontNeedsc']) {
      param.splice(param.length - 1, 0, getSceneId());
    }
    iface.apply(null, param);
  } else { //如果是同步
    if (!otherParam['dontNeedsc']) {
      if (param[param.length - 1] == null || param[param.length - 1] === undefined) {
        param[param.length - 1] = getSceneId();
      } else {
        param.push(getSceneId());
      }
    }
    var result = iface.apply(null, param);
    if (!otherParam['doItSelf']) {
      result = userver.operateRemoteResult(result, otherParam['noprompt'], otherParam['failCB']);
    }
    return result;
  }
};

/*
 * 从json.js复制
 *
 */
(function () {
  var m = {
      '\b': '\\b',
      '\t': '\\t',
      '\n': '\\n',
      '\f': '\\f',
      '\r': '\\r',
      '"': '\\"',
      '\\': '\\\\'
    },
    sort = false,
    isAddQuotation = false, //jw 2017.12.19 是否增加引号，转换3D对象时，有时会缺少引号
    isGetSimpleObj = false, //jw 2017.12.19 是否返回绝大多数字段，有时候会需要
    transCount = 0, //jw 2017.12.20 用isGetForSceneSnapshot时，转换baseObject的数量，过多时候会堆栈溢出，所以只允许转换4个，应该可以满足绝大多数需求
    s = {
      'array': function (x) {
        if (sort) {
          var a = [], b, f, i, l = x.length, v;
          for (i = 0; i < l; i += 1) {
            v = x[i];
            f = s[typeof v];
            if (f) {
              v = f(v);
              if (typeof v == 'string') {
                if (b) {
                  a[a.length] = ',';
                }
                a[a.length] = v;
                b = true;
              }
            }
          }
          a = uinv.util.sortArrayByChar(a);
          uinv.util.insertItemToArray('[', a, 0);
          a[a.length] = ']';
          return a.join('');
        }
        var a = ['['], b, f, i, l = x.length, v;
        for (i = 0; i < l; i += 1) {
          v = x[i];
          f = s[typeof v];
          if (f) {
            v = f(v);
            if (typeof v == 'string') {
              if (b) {
                a[a.length] = ',';
              }
              a[a.length] = v;
              b = true;
            }
          }
        }
        a[a.length] = ']';
        return a.join('');
      },
      'boolean': function (x) {
        return String(x);
      },
      'null': function (x) {
        return 'null';
      },
      'number': function (x) {
        return isFinite(x) ? String(x) : 'null';
      },
      'object': function (x) {
        if (x) {
          if (x instanceof Array) {
            return s.array(x);
          }
          if (typeof t3djs !== 'undefined' && t3djs.SceneNode && x instanceof t3djs.SceneNode) {
            return x.name;
          }
          if (uinv.BaseObject && x instanceof uinv.BaseObject) {
            if (isAddQuotation) {
              return s.string(x.name);
            }
            if (isGetSimpleObj && transCount <= 4) {
              transCount++;
              return s.object(x.getSimpleObj());
            }
            return x.name;
          }
          if (sort) {
            var a = ['{'], b, f, i, v;
            var keys = uinv.hash.keys(x);
            keys = uinv.util.sortArrayByChar(keys);
            var l = keys.length;
            for (i = 0; i < l; i += 1) {
              v = x[keys[i]];
              f = s[typeof v];
              if (f) {
                v = f(v);
                if (typeof v == 'string') {
                  if (b) {
                    a[a.length] = ',';
                  }
                  a.push(s.string(i), ':', v);
                  b = true;
                }
              }
            }
            a[a.length] = '}';
            return a.join('');
          }
          var a = ['{'], b, f, i, v;
          for (i in x) {
            v = x[i];
            f = s[typeof v];
            if (f) {
              v = f(v);
              if (typeof v == 'string') {
                if (b) {
                  a[a.length] = ',';
                }
                a.push(s.string(i), ':', v);
                b = true;
              }
            }
          }
          a[a.length] = '}';
          return a.join('');
        }
        return 'null';
      },
      'string': function (x) {
        if (/["\\\x00-\x1f]/.test(x)) {
          x = x.replace(/([\x00-\x1f\\"])/g, function (a, b) {
            var c = m[b];
            if (c) {
              return c;
            }
            c = b.charCodeAt();
            return '\\u00'
              + Math.floor(c / 16).toString(16)
              + (c % 16).toString(16);
          });
        }
        return '"' + x + '"';
      }
//        ,
//        'function':function (x) {
//            return '"' + x.toString() + '"';
//        }
    };
  /**
   * 对象转字符串
   * @param v 要转换的对象
   * @param config {Object} {
   *        sort:true,  数组排序
   *        isAddQuotation:true, 增加引号
   *        isGetSimpleObj:true 返回大量字段
   *       }
   **/
  uinv.util.toJSON = function (v, config) {
    //wxz_modify:如果传入["1233"],会索引到'number'
    //var f = isNaN(v) ? s[typeof v] : s['number'];
    //if (f) return f(v);
    /////////////////////////////////////////
    transCount = 0;
    if (config) {
      if (config.sort !== undefined) {
        sort = config.sort;
      }
      if (config.isAddQuotation !== undefined) {
        isAddQuotation = config.isAddQuotation;
      }
      if (config.isGetSimpleObj !== undefined) {
        isGetSimpleObj = config.isGetSimpleObj;
      }
    }
    if (v instanceof Array) return s.array(v);

    var f = isNaN(v) ? s[typeof v] : s['number'];
    if (f) return f(v);

    //wxz_modify_end
  };
  /**
   * 字符串转对象
   */
  uinv.util.parseJSON = function (v, safe) {
    return uinv.jsonParse(v);

    // if (safe === undefined) safe = uinv.util.parseJSON.safe;
    // if (safe && !/^("(\\.|[^"\\\n\r])*?"|[,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t])+?$/.test(v))
    //     return undefined;
    // return eval('('+v+')');
  };

  uinv.util.parseJSON.safe = false;
})(uinv.util);
