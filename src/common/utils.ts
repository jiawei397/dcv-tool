const utils: any = {};

/**
 * 查看对象是否包含元素
 * @param {Object} opObject
 * @return {Boolean}
 */
utils.isEmpty = function (opObject) {
  for (let cur in opObject) {
    return false;
  }
  return true;
};

/**
 * 判断是否函数
 */
utils.isFunction = function (obj) {
  return typeof obj === 'function' && typeof obj.nodeType !== 'number';
};

/**
 * 判断是否对象
 */
utils.isObject = function (obj) {
  return Object.prototype.toString.call(obj) === '[object Object]';
};

/**
 * 判断是否字符串
 */
utils.isString = function (obj) {
  return Object.prototype.toString.call(obj) === '[object String]';
};

/**
 * 判断是否错误信息
 */
utils.isError = function (obj) {
  return Object.prototype.toString.call(obj) === '[object Error]';
};

/**
 * 判断是否数字
 */
utils.isNumber = function (obj) {
  return Object.prototype.toString.call(obj) === '[object Number]';
};
/**
 * 克隆对象
 * @param {Object} obj 克隆的对象
 * @param {Boolean} isDeep 是否深度克隆，默认否
 * @param {Function} endFun 停止克隆的条件语句
 * @return {Array}  克隆后的对象
 */
utils.cloneObj = function clone(obj, isDeep, endFun) {
  if (!obj || typeof obj !== 'object' || (utils.isFunction(endFun) && endFun(obj))) {
    return obj;
  }
  let c = obj instanceof Array ? [] : {};
  for (let i in obj) {
    let prop = obj[i];
    if (isDeep && typeof prop == 'object') {
      if (prop instanceof Array) {
        c[i] = [];

        for (let j = 0; j < prop.length; j++) {
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

/**
 * 继承
 */
utils.extend = function (subClass, superClass) {
  let F = function () {
  }, cloneFun = utils.cloneObj;
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
utils.multiExtend = function (subClass, superClasses, repleceExistedMember) {
  if (repleceExistedMember === undefined) repleceExistedMember = true;
  utils.extend(subClass, superClasses[0]);

  for (let i = 1; i < superClasses.length; i++) {
    let curSuperClass = superClasses[i];
    for (let cur in curSuperClass.prototype) {
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

utils.instanceOf = utils.isInstance = function (subClass, superClass) {
  if (subClass instanceof superClass) {
    return true;
  }
  if (subClass && subClass.__extendList) {
    if (subClass.__extendList.includes(superClass)) {
      return true;
    }
  }
  return false;
};

/**
 * 一个空函数
 */
utils.noop = function () {
};

/**
 * 计算表达式的值，替代eval函数
 * @author jw
 * @date 2017-05-22
 */
utils.eval = function (data) {
  let Fn = Function; // 一个变量指向Function，防止有些前端编译工具报错
  return new Fn('return ' + data)();
};

/**
 * 将字符串转换为json对象
 */
utils.jsonParse = function (s, reviver) {
  if (!s || !(typeof s === 'string')) {
    return s;
  }
  let json;
  try {
    json = JSON.parse(s, reviver);
  } catch (e) {
    try {
      json = utils.eval('(' + s + ')'); // 主要用来处理带function的字符串
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
utils.stringify = function (v, replacer, space) {
  if (!v || !(typeof v === 'object')) {
    return v;
  }
  return JSON.stringify(v, replacer, space);
};

/**
 * 安全的随机数
 */
utils.random = (function () {
  let seed = new Date().getTime();
  return function () {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / (233280.0);
  };
})();

export default utils;
