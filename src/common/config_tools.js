/*
 * 事件管理器
 */
import uinv from './uinv_util';

/**
 * @class uinv.ObjectConfigManager 提供通过物体查询配置的功能
 * @author Uinnova Technologies,Inc.
 * @constructor
 * @namespace uinv.ObjectConfigManager
 */
uinv.ObjectConfigManager = function (name) {
  this.name = name;
  this._configLib = {};
  this._coverExisted = false;
  this._useNamePath = false;
};

/**
 * @description 设置注册时是否覆盖存在的注册
 * @param {Boolean} b
 */
uinv.ObjectConfigManager.prototype.setCoverExisted = function (b) {
  this._coverExisted = b;
};

/**
 * @description 返回注册时是否覆盖存在的注册
 * @return {Boolean}
 */
uinv.ObjectConfigManager.prototype.getCoverExisted = function () {
  return this._coverExisted;
};

/**
 * @description 设置注册时是否可以使用一个路径作为名字，用于支持同一个名字下有多子名字的情况
 * @param {Boolean} b 设置的值
 */
uinv.ObjectConfigManager.prototype.setUseNamePath = function (b) {
  this._useNamePath = b;
};

/**
 * @description 返回注册时是否可以使用一个路径作为名字
 * @return {Boolean}
 */
uinv.ObjectConfigManager.prototype.getUseNamePath = function () {
  return this._useNamePath;
};

/**
 * @description 返回是否有注册
 * @return {Boolean}
 */
uinv.ObjectConfigManager.prototype.isEmpty = function () {
  return uinv.hash.isEmpty(this._configLib);
};
/**
 * 注册类型
 * @type
 */
uinv.RegType = {};
uinv.RegType.OBJECT = 'REGTYPE_OBJECT';
uinv.RegType.CLASSID = 'REGTYPE_CLASSID';
uinv.RegType.ATTRIBUTE = 'REGTYPE_ATTRIBUTE';
uinv.RegType.FUNCTION = 'REGTYPE_FUNCTION';
uinv.RegType.METHOD = 'REGTYPE_METHOD';
uinv.RegType.AND = 'REGTYPE_AND';
uinv.RegType.OR = 'REGTYPE_OR';
uinv.RegType.NOT = 'REGTYPE_NOT';
/**
 * 解析注册条件
 * @param {} regCondition
 * @return {Object} { "regType":regType, "regCondition":regCondition }
 */
uinv.ObjectConfigManager.prototype._parseRegCondition = function (regCondition) {
  var regType = 'REGTYPE_OBJECT';
  if (typeof regCondition == 'string') {

  } else if (typeof regCondition == 'number') { // classId
    regCondition = '' + regCondition;
    regType = 'REGTYPE_CLASSID';
  } else if (typeof regCondition == 'object') {
    //object
    if (regCondition.name) {
      regCondition = regCondition.name;
      regType = 'REGTYPE_OBJECT';
    } else {
      //组合and
      if (Array.isArray(regCondition)) {
        regType = 'REGTYPE_AND';
      } else {
        var key = uinv.hash.getFirstKey(regCondition);
        //标示类型的条件
        if (key.indexOf('REGTYPE_') == 0) {
          regType = key;
          regCondition = uinv.hash.getFirstValue(regCondition);
        } else { // attribute
          regType = 'REGTYPE_ATTRIBUTE';
        }
      }
    }
  } else if (uinv.isFunction(regCondition)) {
    regType = 'REGTYPE_FUNCTION';
  }

  return {'regType': regType, 'regCondition': regCondition};
};
/**
 * 解析路径
 * @param {String} name
 * @return {Array}
 */
uinv.ObjectConfigManager.prototype._parsePath = function (name) {
  if (this._useNamePath && typeof name == 'string') {
    if (name.indexOf('/') != -1) {
      name = name.split('/');
    } else if (name.indexOf('\\') != -1) {
      name = name.split('\\');
    }
    if (typeof (name) == 'string') {
//			return [name, "_SingleName_"];
      return [name];
    }
//			if( name.length == 1 ) name.push( "_SingleName_" );
//     return name;
  }
  return name;
};
/**
 * 获取某类物体的指定注册项
 * @param {Object} obj
 * @param {String} path
 * @return {Object}
 */
uinv.ObjectConfigManager.prototype._getValueByPath = function (obj, path) {
  if (this._useNamePath) {
    path = this._parsePath(path);
    for (var i = 0; i < path.length; i++) {
      if (!obj) return undefined;
      obj = obj[path[i]];
    }
    return obj;
  }
  return obj[path];
};
/**
 * 添加某类物体的注册项
 * @param {Object} obj
 * @param {String} path
 * @param {String} value
 */
uinv.ObjectConfigManager.prototype._setValueByPath = function (obj, path, value) {
  if (this._useNamePath) {
    path = this._parsePath(path);
    for (var i = 0; i < path.length - 1; i++) {
      var cur = path[i];
      if (!obj[cur]) obj[cur] = {};
      obj = obj[cur];
    }
    obj[path[path.length - 1]] = value;
  } else obj[path] = value;
};
/**
 * 删除某类物体的注册项
 * @param {Object} obj
 * @param {String} path
 */
uinv.ObjectConfigManager.prototype._delValueByPath = function (obj, path) {
  if (this._useNamePath) {
    path = this._parsePath(path);
    for (var i = 0; i < path.length - 1; i++) {
      var cur = path[i];
      if (!obj[cur]) obj[cur] = {};
      obj = obj[cur];
    }
    delete obj[path[path.length - 1]];
  } else delete obj[path];
};

/**
 * @description 按照输入的注册条件，以一定名字注册内容。
 * @param regCondition 要注册的条件，可以是物体，物体名称，物体classId，物体属性，函数，物体成员函数，以及使用前面的类型进行与或非的组合。
 * @param {String} name 注册的名称,可以不填，系统内部会默认指定name的值是“_NONAME_”
 * @param {Object} param  要注册内容
 * @param {Boolean} forceCoverExisted  忽略内部设置，强制覆盖存在的注册。
 * @returns Boolean
 * @type Boolean
 * @example
 <pre><code>
 //直接输入注册条件
 uinv.objectConfigManager.regConfig( obj, "选择时的样式", {....} );
 uinv.objectConfigManager.regConfig( "objName", "选择时的样式", {....} );
 uinv.objectConfigManager.regConfig( uinv.CLASSID_BUILDING, "选择时的样式", {....} );
 uinv.objectConfigManager.regConfig( {"caption":"生产楼"}, "选择时的样式", {....} );
 uinv.objectConfigManager.regConfig( function(obj){.....}, "选择时的样式", {....} );
 uinv.objectConfigManager.regConfig( [ {"标签/架式设备":true}, {"标签/通讯":true} ], "选择时的样式", {....} ); //输入数组标示是AND组合
 //标示注册条件的类型
 uinv.objectConfigManager.regConfig( { REGTYPE_OBJECT:obj }, "选择时的样式", {....} );
 Uinv.Objectconfigmanager.Regconfig( { Regtype_object:"Objname" }, "选择时的样式", {....} );
 Uinv.Objectconfigmanager.Regconfig( { Regtype_classid:Uinv.Classid_building }, "选择时的样式", {....} );
 uinv.objectConfigManager.regConfig( { REGTYPE_ATTRIBUTE:{"caption":"生产楼"} } , "选择时的样式", {....} );
 uinv.objectConfigManager.regConfig( { REGTYPE_FUNCTION:function(obj){....} }, "选择时的样式", {....} );
 uinv.objectConfigManager.regConfig( { REGTYPE_METHOD:"isEmpty" }, "选择时的样式", {....} );
 uinv.objectConfigManager.regConfig( { REGTYPE_AND:[{"标签/架式设备":true}, {"标签/通讯":true}] }, "选择时的样式", {....} );
 uinv.objectConfigManager.regConfig( { REGTYPE_OR:["objName1", uinv.CLASSID_BUILDING, {"标签/架式设备":true} ] }, "选择时的样式", {....} );
 uinv.objectConfigManager.regConfig( { REGTYPE_NOT:[{REGTYPE_CLASSID:uinv.CLASSID_BUILDING}, {"标签/通讯":true}] }, "选择时的样式", {....} );
 <pre><code>
 */
/**
 * 注册事件
 * @param {} regCondition 条件
 * @param {String} name 名字
 * @param {Object} param 参数 {"once": true,"func":function(XX){}}  其中，once指只执行一次，执行后就被取消了，不传递时默认不取消；func为事件回调
 * @param {Boolean} forceCoverExisted 是否覆盖原有配置
 * @return {Boolean}
 */
uinv.ObjectConfigManager.prototype.regConfig = function (regCondition, name, param, forceCoverExisted) {
  if (!name) name = '_NONAME_';
  if (regCondition == null) regCondition = '_default_';
  var result = this._parseRegCondition(regCondition);
  var regType = result['regType'];
  regCondition = result['regCondition'];

  if (!this._configLib[regType]) {
    this._configLib[regType] = {};
  }

  var params;
  if (regType == 'REGTYPE_ATTRIBUTE'
    || regType == 'REGTYPE_FUNCTION'
    || regType == 'REGTYPE_AND' || regType == 'REGTYPE_OR' || regType == 'REGTYPE_NOT') {
    if (!this._configLib[regType]['conditions']) {
      this._configLib[regType]['conditionsStr'] = [];
      this._configLib[regType]['conditions'] = [];
      this._configLib[regType]['params'] = [];
    }

    var conditionStr;
    if (regType == 'REGTYPE_FUNCTION') conditionStr = regCondition.toString();
    else conditionStr = JSON.stringify(regCondition);

    conditionStr = conditionStr.replaceAll(' ', '');

    var index = uinv.util.findItemInArray(this._configLib[regType]['conditionsStr'], conditionStr);
    if (index == -1) {
      this._configLib[regType]['conditionsStr'].push(conditionStr);
      this._configLib[regType]['conditions'].push(regCondition);
      this._configLib[regType]['params'].push({});
      index = this._configLib[regType]['conditionsStr'].length - 1;
    }
    params = this._configLib[regType]['params'][index];
  } else {
    if (!this._configLib[regType][regCondition]) this._configLib[regType][regCondition] = {};
    params = this._configLib[regType][regCondition];
  }

  if (!this.getCoverExisted() && !forceCoverExisted) {
    if (this._getValueByPath(params, name)) {
      var n = this.name;
      if (!n) n = '';
      if (uinv.again) return false;//whj 2016-07-06
      if (uinv.util.confirm(['DCV_THE_REGISTRATION_MODULE_REPEATEDLY_DEFINES_1_DO_YOU_WANT_TO_RUN_TO_THE_BREAKPOINT', [n, '' + name]])) {
        // stopJs[0] = 0;
        debugger;
      }
      return false;
    }
  }
  this._setValueByPath(params, name, param);

  //return true;
  //有的模块如uinv.ObjectEffectManager需要regConfig后的数据，这里需要返回
  return param;
};

/**
 * @description 按照输入的注册条件和名称获得注册的内容。
 * @param {} regCondition 要注册的条件，可以是物体，物体名称，物体classId，物体属性，函数，物体成员函数，以及使用前面的类型进行与或非的组合。
 * @param name {String} 注册的名称,可以不填，系统内部会默认指定name的值是“_NONAME_”
 * @returns {Object}
 * @type Object
 */
uinv.ObjectConfigManager.prototype.getConfigByRegCondition = function (regCondition, name) {
  if (!name) name = '_NONAME_';
  var result = this._parseRegCondition(regCondition);
  var regType = result['regType'];
  var regCondition = result['regCondition'];

  if (!this._configLib[regType]) return undefined;

  if (regType == 'REGTYPE_ATTRIBUTE'
    || regType == 'REGTYPE_FUNCTION'
    || regType == 'REGTYPE_AND' || regType == 'REGTYPE_OR' || regType == 'REGTYPE_NOT') {
    var conditionStr;
    if (regType == 'REGTYPE_FUNCTION') conditionStr = regCondition.toString();
    else conditionStr = JSON.stringify(regCondition);
    conditionStr = conditionStr.replaceAll(' ', '');

    var index = uinv.util.findItemInArray(this._configLib[regType]['conditionsStr'], conditionStr);
    if (index == -1) return undefined;
    if (!this._getValueByPath(this._configLib[regType]['params'][index], name)) return undefined;
    return this._getValueByPath(this._configLib[regType]['params'][index], name);
  }
  if (this._configLib[regType][regCondition]) return this._getValueByPath(this._configLib[regType][regCondition], name);

  return undefined;
};

/**
 * @description 按照输入的注册条件和名称查看是否存在注册。
 * @param regCondition 注册的条件，可以是物体，物体名称，物体classId，物体属性，函数，物体成员函数，以及使用前面的类型进行与或非的组合。
 * @param name {String} 注册的名称,可以不填，系统内部会默认指定name的值是“_NONAME_”
 * @returns {Boolean}
 * @type Boolean
 */
uinv.ObjectConfigManager.prototype.hasConfigByRegCondition = function (regCondition, name) {
  if (!name) name = '_NONAME_';
  var result = this._parseRegCondition(regCondition);
  var regType = result['regType'];
  var regCondition = result['regCondition'];

  if (!this._configLib[regType]) return false;

  if (regType == 'REGTYPE_ATTRIBUTE'
    || regType == 'REGTYPE_FUNCTION'
    || regType == 'REGTYPE_AND' || regType == 'REGTYPE_OR' || regType == 'REGTYPE_NOT') {
    var conditionStr;
    if (regType == 'REGTYPE_FUNCTION') {
      conditionStr = regCondition.toString();
    } else {
      conditionStr = JSON.stringify(regCondition);
    }
    conditionStr = conditionStr.replaceAll(' ', '');

    var index = uinv.util.findItemInArray(this._configLib[regType]['conditionsStr'], conditionStr);
    if (index == -1) return false;
    if (!this._getValueByPath(this._configLib[regType]['params'][index], name)) return false;
    return this._getValueByPath(this._configLib[regType]['params'][index], name);
  }
  if (this._configLib[regType][regCondition]) return this._getValueByPath(this._configLib[regType][regCondition], name);

  return false;
};

/**
 * @description 修改注册的内容。
 * @param regCondition 注册的条件，可以是物体，物体名称，物体classId，物体属性，函数，物体成员函数，以及使用前面的类型进行与或非的组合。
 * @param name {String} 注册的名称,可以不填，系统内部会默认指定name的值是“_NONAME_”
 * @param param {Object} 需要变动的内容，内容会将其和原内容进行混合操作(通过uinv.hash.combine)
 * @returns {Boolean}
 * @type Boolean
 */
uinv.ObjectConfigManager.prototype.modifyConfig = function (regCondition, name, param) {
  if (!name) name = '_NONAME_';
  var config = this.getConfigByRegCondition(regCondition, name);
  if (config) {
    uinv.hash.combine(config, param);
    return true;
  }
  return false;
};

/**
 * @description 注销注册
 * @param regCondition 注册的条件，可以是物体，物体名称，物体classId，物体属性，函数，物体成员函数，以及使用前面的类型进行与或非的组合。
 * @param name {String} 注册的名称,可以不填，系统内部会注销关于regCondition的所有设置
 * @returns {Boolean}
 * @type Boolean
 */
uinv.ObjectConfigManager.prototype.unregConfig = function (regCondition, name) {
  if (!name) name = '_NONAME_';
  var result = this._parseRegCondition(regCondition);
  var regType = result['regType'];
  regCondition = result['regCondition'];

  if (!this._configLib[regType]) return true;

  if (regType == 'REGTYPE_ATTRIBUTE'
    || regType == 'REGTYPE_FUNCTION'
    || regType == 'REGTYPE_AND' || regType == 'REGTYPE_OR' || regType == 'REGTYPE_NOT') {
    var conditionStr;
    if (regType == 'REGTYPE_FUNCTION') conditionStr = regCondition.toString();
    else conditionStr = JSON.stringify(regCondition);
    conditionStr = conditionStr.replaceAll(' ', '');

    var index = uinv.util.findItemInArray(this._configLib[regType]['conditionsStr'], conditionStr);
    if (index == -1) return true;

    if (name == '_NONAME_') {
      this._configLib[regType]['conditionsStr'].splice(index, 1);
      this._configLib[regType]['conditions'].splice(index, 1);
      this._configLib[regType]['params'].splice(index, 1);
    } else {
      if (!this._getValueByPath(this._configLib[regType]['params'][index], name)) return true;
      this._delValueByPath(this._configLib[regType]['params'][index], name);
      if (uinv.hash.isEmpty(this._configLib[regType]['params'][index])) {
        this._configLib[regType]['conditionsStr'].splice(index, 1);
        this._configLib[regType]['conditions'].splice(index, 1);
        this._configLib[regType]['params'].splice(index, 1);
      }
    }

    if (this._configLib[regType]['conditions'].length == 0) {
      delete this._configLib[regType];
    }
  } else {
    if (name == '_NONAME_') {
      delete this._configLib[regType][regCondition];
    } else {
      if (this._configLib[regType][regCondition] !== undefined) {
        this._delValueByPath(this._configLib[regType][regCondition], name);
        if (uinv.hash.isEmpty(this._configLib[regType][regCondition])) {
          delete this._configLib[regType][regCondition];
        }
      }
    }

    if (uinv.hash.isEmpty(this._configLib[regType])) {
      delete this._configLib[regType];
    }
  }
};
/**
 * 检查注册条件
 * @param {Object} obj
 * @param {String} type
 * @param {Boject} condition
 * @return {Boolean}
 */
uinv.ObjectConfigManager.prototype._checkConditions = function (obj, type, condition) {
  if (!obj) return false;
  if (type == uinv.RegType.OBJECT) {
    return (obj.name == condition);
  } else if (type == uinv.RegType.CLASSID) {
    return ('' + obj.classId == condition);
  } else if (type == uinv.RegType.ATTRIBUTE) {
    for (var cur in condition) {
//			if( !obj.getAttribute) {
//				return false;
//			} else if( "" + obj.getAttribute(cur)  != "" + condition[cur]){
//				return false;
//			}
      //2015-06-03 liqun 为了配合uinv.ignoreParseObjectAtrributeList修改了此处
      if (uinv.util.getAttribute(obj, cur) != condition[cur]) {
        return false;
      }
    }
    return true;
  } else if (type == uinv.RegType.FUNCTION) {
    return (condition(obj));
  } else if (type == uinv.RegType.METHOD) {
    return (obj[condition]());
  } else if (type == uinv.RegType.AND) {
    var count = condition.length;
    for (var i = 0; i < count; i++) {
      var cond = this._parseRegCondition(condition[i]);
      if (!this._checkConditions(obj, cond['regType'], cond['regCondition'])) return false;
    }
    return true;
  } else if (type == uinv.RegType.OR) {
    var count = condition.length;
    for (var i = 0; i < count; i++) {
      var cond = this._parseRegCondition(condition[i]);
      if (this._checkConditions(obj, cond['regType'], cond['regCondition'])) return true;
    }
    return false;
  } else if (type == uinv.RegType.NOT) {
    var count = condition.length;
    for (var i = 0; i < count; i++) {
      var cond = this._parseRegCondition(condition[i]);
      if (this._checkConditions(obj, cond['regType'], cond['regCondition'])) return false;
    }
    return true;
  }
  return false;
};
/**
 * 检查注册条件
 * @param {Object} obj
 * @param {Object} condition
 * @return {Boolean}
 */
uinv.ObjectConfigManager.prototype.checkCondition = function (obj, condition) {
  var condition = this._parseRegCondition(condition);
  return this._checkConditions(obj, condition['regType'], condition['regCondition']);
};

/**
 * @description 按照输入和名称查看是否存在注册。
 * @param input 输入可以是物体，物体名称，物体classId
 * @param {String} name 注册的名称,可以不填，系统内部会默认指定name的值是“_NONAME_”
 * @returns {Boolean}
 * @type Boolean
 */
uinv.ObjectConfigManager.prototype.hasConfig = function (input, name) {
  if (!name) name = '_NONAME_';

  var classId;
  var objName;

  if (typeof (input) == 'number') classId = '' + input;
  else if (input == null || input == undefined) {
    objName = '_default_';
  } else if (typeof input == 'object') {
    //modified 2014.01.13 wxz 让input 支持 后台数据的形式
    if (input.name) {
      objName = input.name;
      classId = '' + input.classId;
    } else if (input._ID_) {
      objName = input._ID_;
    }
  } else {
    //如果输入字符串，可能是objName,也可能是classID。
    objName = input;
    classId = input;
    if (uinv.isUse3D) { //如果使用3d
      if (!uinv.isUseNode || uinv.isInNode()){
        var obj = uinv.factory.getObject(objName);
        if (obj) {
          classId = '' + obj.classId;
        }
      }
    }
  }
  //在物体注册里找
  if (objName && this._configLib[uinv.RegType.OBJECT]
    && this._configLib[uinv.RegType.OBJECT][objName] && this._getValueByPath(this._configLib[uinv.RegType.OBJECT][objName], name)) {
    return this._getValueByPath(this._configLib[uinv.RegType.OBJECT][objName], name);
  }
  //这里要求输入物体
  if (typeof (input) == 'object') {
    var checkList = [uinv.RegType.FUNCTION, uinv.RegType.METHOD, uinv.RegType.AND, uinv.RegType.OR, uinv.RegType.NOT, uinv.RegType.ATTRIBUTE];
    for (var ci = 0; ci < checkList.length; ci++) {
      var regType = checkList[ci];
      if (this._configLib[regType]) {
        var conditions = this._configLib[regType]['conditions'];
        var count = conditions.length;
        for (var i = 0; i < count; i++) {
          if (this._checkConditions(input, regType, conditions[i])) {
            if (this._getValueByPath(this._configLib[regType]['params'][i], name)) {
              return this._getValueByPath(this._configLib[regType]['params'][i], name);
            }
          }
        }
      }
    }
  }
  //最后在classId注册里找
  if (classId && this._configLib[uinv.RegType.CLASSID]
    && this._configLib[uinv.RegType.CLASSID][classId] && this._getValueByPath(this._configLib[uinv.RegType.CLASSID][classId], name)) {
    return this._getValueByPath(this._configLib[uinv.RegType.CLASSID][classId], name);
  }

  return null;
};

/**
 * @description 按照输入和名称获取注册。
 * @param input 输入可以是物体，物体名称，物体classId
 * @param name {String} 注册的名称,可以不填，系统内部会默认指定name的值是“_NONAME_”
 * @param ignoreDefault {Boolean} 如果没有找到配置，系统会取默认的配置，这个参数控制是否取默认的配置。如果不传表示 ignoreDefault = false
 * @returns {Object}
 * @type Object
 */
uinv.ObjectConfigManager.prototype.getConfig = function (input, name, ignoreDefault) {
  if (!name) name = '_NONAME_';
  if (input == null) input = '_default_';
  var tmp = this.hasConfig(input, name);
  if (tmp) {
    return tmp;
  } else if (!ignoreDefault) {
    if (this._configLib[uinv.RegType.OBJECT] && this._configLib[uinv.RegType.OBJECT]['_default_']) {
      if (this._getValueByPath(this._configLib[uinv.RegType.OBJECT]['_default_'], name)) {
        return this._getValueByPath(this._configLib[uinv.RegType.OBJECT]['_default_'], name);
      } else if (this._configLib[uinv.RegType.OBJECT]['_default_']['_default_']) {
        return this._configLib[uinv.RegType.OBJECT]['_default_']['_default_'];
      }
    }
    return null;
  }
  return null;
};

/**
 * 实例化物体注册管理器
 */
uinv.objectConfigManager = new uinv.ObjectConfigManager();

/**
 * @class 物体事件管理器
 * @namespace uinv.ObjectEventManager
 * @extends uinv.ObjectConfigManager
 */
uinv.ObjectEventManager = function () {
  uinv.ObjectEventManager.superclass.constructor.call(this);
  this.setCoverExisted(true);
  this.setUseNamePath(true);

  this.ignoreEventLib = new uinv.ObjectConfigManager('ObjectEventManager.ignoreEventLib');
  this.ignoreEventLib.setCoverExisted(true);
  this.ignoreEventLib.setUseNamePath(true);
};
uinv.extend(uinv.ObjectEventManager, uinv.ObjectConfigManager);

/**
 * 临时忽略物体事件
 * @return {}
 */
uinv.ObjectEventManager.prototype.regIgnoreConfig = function () {
  var list = this._parsePath(arguments[1]);
  if (list.length == 1) list.push('_single_');

  arguments[1] = list;
  return this.ignoreEventLib.regConfig(arguments[0], arguments[1], true);
};

/**
 * 恢复临时忽略物体事件
 * @return {}
 */
uinv.ObjectEventManager.prototype.unregIgnoreConfig = function () {
  return this.ignoreEventLib.unregConfig.apply(this.ignoreEventLib, arguments);
};

/**
 * 判断是不是临时忽略物体事件
 * @return {}
 */
uinv.ObjectEventManager.prototype.isIgnoreEnvent = function () {
  var list = this._parsePath(arguments[1]);
  if (list.length == 1) list.push('_single_');
  arguments[1] = list;

  var b = this.ignoreEventLib.getConfig.apply(this.ignoreEventLib, arguments);
  return b;
};

/**
 * 注册物体事件
 * @return {}
 */
uinv.ObjectEventManager.prototype.regConfig = function () {
  var list = this._parsePath(arguments[1]);
  if (list.length == 1) list.push('_single_');

  arguments[1] = list;
  if (arguments[2]['priority'] === undefined) arguments[2]['priority'] = 50;
  arguments[2]['eventName'] = list;
  return uinv.ObjectEventManager.superclass.regConfig.apply(this, arguments);
};
/**
 * 执行事件
 * @param {Object} event
 * @param {Array} eventParam
 * @param {Object} obj
 * @return {}
 */
uinv.ObjectEventManager.prototype._fireEvent = function (event, eventParam, obj) {
  var param = [];
  if (event['paramFunc']) {
    param = event['paramFunc'](obj);
  } else if (event['param']) {
    param = event['param'];
  } else if (event['inputAndEventParam']) {
    param = event['param'];
    if (!(param instanceof Array)) param = [param];
    if (!(eventParam instanceof Array)) eventParam = [eventParam];

    param = param.concat(eventParam);
  } else if (eventParam) {
    param = eventParam;
  }

  if (event['objectMethodName']) {
    return obj[event['objectMethodName']].apply(obj, param);
  } else if (event['moduleMethod']) {
    var module = event['moduleMethod'][0];
//			uinv.util.insertItemToArray(obj, param, 0);
    return module[event['moduleMethod'][1]].apply(module, param);
  } else if (event['func']) {
    if (!(param instanceof Array)) param = [param];
//			uinv.util.insertItemToArray(obj, param, 0);
    return event['func'].apply(null, param);
  }
};
/**
 * 执行事件
 * @private
 * @param {Object} obj
 * @param {String} eventName
 * @param {Array} eventParam
 * @param {Boolean} ignoreDefault
 * @return {Boolean}
 */
uinv.ObjectEventManager.prototype.fireEvent = function (obj, eventName, eventParam, ignoreDefault) {
  var isAllEnvent = true;
  var list = this._parsePath(eventName);
  if (!list || list.length == 0) {
    return;
  }
  if (list.length == 2) isAllEnvent = false;

  var event1 = this.getConfig(obj, eventName, ignoreDefault);

  if (event1) {
    if (isAllEnvent) {
      var isReturn = false;

      //根据priority排序
      var eventList = uinv.hash.values(event1);
      eventList = uinv.util.sortArrayByNumber(eventList, {'useAttribute': 'priority'});

      for (var i = 0; i < eventList.length; i++) {
        var e = eventList[i];
        if (this.isIgnoreEnvent(obj, e['eventName'])) {
          continue;
        }
        if (this.isIgnoreEnvent(obj, e['eventName'][0])) {
          continue;
        }
        var rv = this._fireEvent(e, eventParam, obj);
        if (e.once === true) { //jw 2017.11.23 只执行一次的事件
          this.unregConfig(obj, eventName);
        }
        //TX 2017年9月27日14:04:10 增减返回如果是STOP_THE_REST则忽略后面相同事件
        if (rv == 'STOP_THE_REST') {
          isReturn = true;
          break;
        }
        if (rv) { //jw 2017.05.22 之前未传递obj，未定义
          isReturn = true;
        }
      }
      return isReturn;
    }
    return this._fireEvent(event1, eventParam, obj);
  }

  return false;
};

/**
 * 实例化
 */
uinv.objectEventManager = new uinv.ObjectEventManager();

uinv.objectTextBubbleManager = new uinv.ObjectConfigManager();

export default uinv;
