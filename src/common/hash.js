import uinv from './uinv';

const hash = {};
/**
 * 获取对象中元素数目
 * @param {Object} opObject
 * @return {Number}
 */
hash.getSize = function (opObject) {
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
hash.isEmpty = function (opObject) {
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
hash.hasKey = function (opObject, key) {
  // return typeof opObject[key] != 'undefined';
  if (opObject != null) {
    return opObject.hasOwnProperty(key);
  }
  console.error('传入opObject参数有误');
  return false;
};
/**
 * 重新命名对象元素
 * @param {Object} opObject
 * @param {String} oldKey
 * @param {String} newKey
 */
hash.renameKey = function (opObject, oldKey, newKey) {
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
hash.getFirstKey = function (opObject) {
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
hash.keys = function (opObject) {
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
hash.getFirstValue = function (opObject) {
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
hash.values = function (opObject) {
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
hash.clear = function (opObject) {
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
hash.combine = function fun (opObjectA, opObjectB, isDeep, isReturnNew, isCloneObjDeep) {
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

/**
 * 合并对象 只会在A的基础上添加元素,不影响原有元素 返回长大了的A
 * @param {Object} opObjectA
 * @param {Object} opObjectB
 * @param {Boolean} isDeep
 * @param {Boolean} isReturnNew
 * @param {Boolean} isCloneObjDeep
 * @return {Object}
 */
hash.combineNew = function fun (opObjectA, opObjectB, isDeep, isReturnNew, isCloneObjDeep) {
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

/**
 * 消减对象 消减A与B中相同的元素 返回被消减的A
 * @param {Object} opObjectA
 * @param {Object} opObjectB
 * @param {Boolean} isReturnNew
 * @return {Object}
 */
hash.subtract = function (opObjectA, opObjectB, isReturnNew) {
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
hash.getIntersection = function (opObjectA, opObjectB, keepValueSame) {
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

export default hash;
