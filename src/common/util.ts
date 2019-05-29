import uinv from './uinv';
import {throttle, debounce} from './throttle';
import delay from './delay';
import createUUID from './uuid';

const util: any = {};

util.throttle = throttle;
util.debounce = debounce;
util.delay = delay;
util.cloneObj = uinv.cloneObj;
util.createUUID = createUUID;

/**
 * 获取2个数之间的随机整数
 */
util.ramdom = function (max: number, min: number) {
  if (max < min) {
    [min, max] = [max, min];
  }
  return Math.round(uinv.random() * (max - min) + min);
};

/**
 * 为属性解析路径
 * @param {String} name 需要解析的路径
 * @return {Array} 解析后的路径
 * @example util._parsePathForAttribute(path);
 */
util._parsePathForAttribute = function (name) {
  if (typeof name === 'string') {
    if (name.indexOf('/') != -1) {
      name = name.split('/');
    } else if (name.indexOf('\\') != -1) {
      name = name.split('\\');
    }
    if (typeof name == 'string') {
      return [name];
    }
  }
  return name;
};

/**
 * 获取属性
 * @param {Object} obj 对象
 * @param {String} path 路径
 * @return {Object} 属性值
 */
util.getAttribute = function (obj: object, path: string) {
  path = util._parsePathForAttribute(path);
  for (let i = 0; i < path.length; i++) {
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
util.setAttribute = function (obj: object, path: string, value: string) {
  path = util._parsePathForAttribute(path);
  for (let i = 0; i < path.length - 1; i++) {
    let cur = path[i];
    if (!obj[cur]) obj[cur] = {};
    obj = obj[cur];
  }
  obj[path[path.length - 1]] = value;
};

/**
 * 删除属性
 * @param {Object} obj
 * @param {String} path
 */
util.delAttribute = function (obj: object, path: string) {
  path = util._parsePathForAttribute(path);
  for (let i = 0; i < path.length - 1; i++) {
    let cur = path[i];
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
util.filenameFromPath = function (opFilename: string) {
  opFilename = (opFilename as any).replaceAll('/', '\\');
  let pos = opFilename.lastIndexOf('\\');
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
util.getFilenamePath = function (opFilename: string) {
  let pos = opFilename.lastIndexOf('\\');
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
util.getFilenameFile = function (opFilename: string) {
  let filename = util.filenameFromPath(opFilename);
  let pos = filename.lastIndexOf('.');
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
util.getFilenameType = function (opFilename: string) {
  let pos = opFilename.lastIndexOf('.');
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
 * @param {Boolean} keepFirst 是否保留第一个重复值，默认不保留。结果其实差不多，只是重复值顺序不一样
 * @return {Array} 删除了重复项的数组
 * @example util.unique([1,2,1])  得到结果[2,1]
 *          util.unique([1,2,1], true)  得到结果[1,2]
 */
util.unique = function (results: [any], keepFirst?: boolean) {
  let delList = [];

  for (let i = 0; i < results.length; i++) {
    for (let ii = i + 1; ii < results.length; ii++) {
      if (results[i] == results[ii]) {
        if (keepFirst) util.addNewItemToArray(ii, delList);
        else util.addNewItemToArray(i, delList);
      }
    }
  }

  util.delItemsByIndexArray(results, delList);
  return results;
};

/**
 * 清空数组
 * @param {Array} opArray  对象数组
 * @return {Array}  返回为空的数组
 */
util.clearArray = function (opArray: [any]) {
  opArray.splice(0, opArray.length);
  return opArray;
};

/**
 * 在数组中找到指定元素的位置(以0开始)
 * @param {Array} opArray  对象数组
 * @param {String} opValue  要查找值
 * @return {String}  返回位置，未找到返回-1
 */
util.findItemInArray = function (opArray: [any], opValue: any) {
  for (let i = 0; i < opArray.length; i++) {
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
util.isInArray = function (opValue: any, opArray: [any]) {
  return this.findItemInArray(opArray, opValue) != -1;
};

/**
 * 清空数组中空元素
 * @param {Array} opArray
 * @return {Array}
 */
util.clearEmptyItemInArray = function (opArray: [any]) {
  for (let i = 0; i < opArray.length; i++) {
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
util.addNewItemToArray = function (opValue: any, opArray: [any]) {
  for (let i = 0; i < opArray.length; i++) {
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
 * @param {Number} index    插入的位置
 * @return {Array} 新数组
 */
util.insertItemToArray = function (opValue: any, opArray: [any], index: number) {
  opArray.splice(index, 0, opValue);
  return opArray;
};

/**
 * 获取两个数组中相同的元素
 * @param {Array} opArrayA 数组1
 * @param {Array} opArrayB 数组2
 * @return {String}  数组中相同的元素
 */
util.getConcomitanceBetweenArrays = function (opArrayA: [any], opArrayB: [any]) {
  let result = [];
  for (let i = 0; i < opArrayA.length; i++) {
    let itemA = opArrayA[i];
    if (util.findItemInArray(opArrayB, itemA) != -1) {
      util.addNewItemToArray(itemA, result);
    }
  }
  return result;
};

// array 有 concat 的方法,但不能直接将源数据改变
/**
 * 链接两个数组 把两个数组合成一个数组,相同元素会分别保留,两个必须是数组,不能一个数组一个字符串
 * @param {Array} opArrayA  数组1
 * @param {Array} opArrayB  数组2
 * @param {Boolean} returnNew  是否返回新数组
 * @return {Array} 新数组
 */
util.mergeArrays = function (opArrayA: [any], opArrayB: [any], returnNew?: boolean) {
  if (returnNew) {
    return opArrayA.concat(opArrayB);
  }

  for (let i = 0; i < opArrayB.length; i++) {
    opArrayA.push(opArrayB[i]);
  }
  return opArrayA;
};

/**
 * 往数组A中合并入数B，有则不插入，返回长大的A。此举不会去除A中重复元素
 * @author jw
 * @date 2017-07-19
 */
util.concatArrays = function (opArrayA: [any], opArrayB: [any]) {
  for (let i = 0; i < opArrayB.length; i++) {
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
util.subtractArrays = function (opArrayA: [any], opArrayB: [any]) {
  let result = [];
  for (let i = 0; i < opArrayA.length; i++) {
    let itemA = opArrayA[i];
    if (util.findItemInArray(opArrayB, itemA) == -1) {
      util.addNewItemToArray(itemA, result);
    }
  }
  return result;
};

/**
 * 合并后一数组到前一数组里
 * @param {Array} arr 旧数组
 * @param {Array} newArr 需要被合并的数组
 */
util.concatArr = function (arr: [any], newArr: [any]) {
  [].push.apply(arr, newArr);
  return arr;
};

//////////////////////////////////////////////////////////////////////////////////
/**
 * 数组排序,升序
 * @param {Array} a
 * @param {Array} b
 * @return {Array}
 */
util._ArraySort_Up = function (a, b) {
  return a - b;
};
/**
 * 数组排序,降序
 * @param {Array} a
 * @param {Array} b
 * @return {Array}
 */
util._ArraySort_Down = function (a, b) {
  return b - a;
};
/**
 * 根据位置序列删除数组元素
 * @param {Array} opA 数组
 * @param {Array} opIA 序列数组
 */
util.delItemsByIndexArray = function (opA: [any], opIA: [any]) {
  opIA.sort(util._ArraySort_Down);
  for (let i = 0; i < opIA.length; i++) {
    opA.splice(opIA[i], 1);
  }
};

/**
 * 从数组中删除指定元素,如果指定元素有多个,也只是删除最前面的一个
 * @param {Array} opA  对象数组
 * @param {String} opItem  要删除的元素
 */
util.delFirstItemFromArray = function (opA: [any], opItem: string) {
  let pos = util.findItemInArray(opA, opItem);
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
util.getItemsFromArrayByKey = function (opA: any, key: string) {
  if (!(opA instanceof Array)) opA = [opA];
  return opA.reduce(function (arr: [any], obj: object) {
    if (obj && obj[key] !== undefined) {
      arr.push(obj[key]);
    }
    return arr;
  }, []);
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
util.getItemsFromArrayByKeys = function (opA: [any], keys: [any], isAllowNull?: boolean) {
  if (!(opA instanceof Array)) opA = [opA];
  if (!(keys instanceof Array)) keys = [keys];
  let values = [];
  opA.forEach(function (obj) {
    let value = {};
    keys.forEach(function (key) {
      if (obj && key) {
        if (isAllowNull && obj[key] !== undefined) {
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
util.getAttrsFromObjectByKeys = function (obj: object, keys: [any], isFilterNull?: boolean) {
  if (!(keys instanceof Array)) {
    if (obj && keys) {
      return obj[keys];
    }
  } else {
    let values = [];
    let value = {};
    keys.forEach(function (key) {
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
let CHINESE_CHARS = '123456789ABCDE';
/**
 * 根据汉字字符进行排序
 * @param {Array} opA  要排序的数组
 * @param {Object} param
 * @return {Array}  排序后的数组
 * @example util.sortArrayByChar(keys);
 */
util.sortArrayByChar = function (opA: [any], param) {
  return opA.sort(function (c1, c2) {
    let a;
    let b;
    if (param && param['useAttribute']) {
      a = ('' + util.getAttribute(c1, param['useAttribute'])).split('');
      b = ('' + util.getAttribute(c2, param['useAttribute'])).split('');
    } else {
      a = ('' + c1).split('');
      b = ('' + c2).split('');
    }

    for (let i = 0; i < a.length; i++) {
      if (b[i] === undefined) return 1;
      if (a[i] == b[i]) continue;

      let indexa = CHINESE_CHARS.indexOf(a[i]);
      let indexb = CHINESE_CHARS.indexOf(b[i]);
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

interface ISortArray {
  useAttribute: any;
  dir: string;
}

/**
 * 数组排序,根据数字
 * @param {Array} opA  要排序的数组
 * @param {Object} param 排序的条件
 * @return {Array}    排序后的数组
 */
util.sortArrayByNumber = function (opA: [any], param: ISortArray) {
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
 * 不管格式，字符串也可以
 */
util.isNum = function (num) {
  let reNum = /^\d*$/;
  return num !== '' && reNum.test(num);
};

/**
 * 把 Number 四舍五入为指定小数位数的数字
 * @param {Number} num    数字
 * @param {Number} toFixed  位数
 * @param {Boolean} force 是否所有数都保留位数，即整数3转换后为3.00之类
 * @return {Number}  四舍五入后的数字
 */
util.toFixed = function (num: number, toFixed: number, force: boolean = false) {
  if (force) {
    return num.toFixed(toFixed);
  }
  let str = num.toString();
  let pos = str.indexOf('.');
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
util.normalizeColor = function (input, colorSystem) {
  if (typeof input == 'string') {
    if (input.indexOf(' ') != -1) input = input.split(' ');
    else if (input.indexOf(',') != -1) input = input.split(',');
  }

  let result = [input[0], input[1], input[2], input[3]];

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

// colorSystem 为 1 :"0.1 0.1 0.1" ; colorSystem 为255 :"232 32 34"
/**
 * 解析网页颜色
 * @param {Array} input
 * @param {Number} colorSystem
 * @return {Array}
 */
util.parseWebColor = function (input, colorSystem) {
  if (typeof input == 'string') {
    if (input.indexOf(' ') != -1) input = input.split(' ');
    else if (input.indexOf(',') != -1) input = input.split(',');
  }
  if (colorSystem === undefined) {
    if (input[0] <= 1 && input[1] <= 1 && input[2] <= 1) colorSystem = 1;
  }

  let tmp = [input[0], input[1], input[2]];
  if (colorSystem == 1) {
    tmp[0] = Math.round(tmp[0] * 255);
    tmp[1] = Math.round(tmp[1] * 255);
    tmp[2] = Math.round(tmp[2] * 255);
  }
  let result = '#';
  for (let i = 0; i < tmp.length; i++) {
    let n = Number(tmp[i]).toString(16);
    let Numbern = Number(n);
    if (isNaN(Numbern)) {
      if (n.length == 1) { // 有可能是a,b,c,d,e,f需要补0
        n = '0' + n;
      }
    } else {
      if (Numbern < 10) { // 小于10时补0
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
util.toHexString = function (input: string) {
  if (typeof input == 'string') {
    let colors = input.split('#');
    let color: string = colors[1];
    let layerColor = [0, 0, 0];
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
util.delSpaceCharacter = function (characters: string) {
  let pattern = new RegExp('[`~!@#$^&*()=|{}\':;\',\\[\\].<>/?~！@#￥……&*（）%％|【】‘；：”“\'。，、？-]');
  let rs = '';
  for (let i = 0; i < characters.length; i++) {
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
util.replaceMark = function (s: string, isOutSpace: boolean = false) {
  // let pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）%％|【】‘；：”“'。，、？]");
  let pattern = new RegExp('[`~^*=|{}<>￥……*|‘”“\']');
  let rs = '';
  for (let i = 0; i < s.length; i++) {
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
util.testMark = function (s: string) {
  let pattern = new RegExp('[`~^*|{}<>￥……*|‘”“]');
  // let pattern = new RegExp("[`~!@#$^&*()=|{}:;,\\[\\].<>/?~！@#￥……&*（）%％|【】‘；：”“。，、？]");
  return pattern.test(s);
};

/**
 * 删除所有空格和单引号
 * @author jw
 * @date 2016-11-24
 */
util.delSpace = function (s: string) {
  s = s.replace(/\s/gi, '');
  s = s.replace(/'/gi, '');
  s = s.replace(/"/gi, '');
  return s;
};

/**
 * @description base64加密
 * @param {String} str 字符串
 *
 */
util.base64Encode = function (str: string) {
  let base64EncodeChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  let out, i, len;
  let c1, c2, c3;

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
 * 判断字符串的开头字符，如果以判断的值开头则返回true
 * @param {} str    目标字符串
 * @param {} startStr  开头字符
 */
util.stringStartWith = function (str: string, startStr: string) {
  let reg = new RegExp('^' + startStr);
  return reg.test(str);
};

/**
 * 判断字符串的结束字符，如果以判断的值结尾则返回true
 * @param {} str    目标字符串
 * @param {} endStr  结束字符
 */
util.stringEndWith = function (str: string, endStr: string) {
  let reg = new RegExp(endStr + '$');
  return reg.test(str);
};

/**
 * 平铺数组中数组
 * @param {Array} arr 数组
 * @return {Array}
 */
util.flatten = function flatten(arr: any) {
  return arr.reduce(function (a, b) {
    return a.concat(Array.isArray(b) ? flatten(b) : b);
  }, []);
};

/**
 * dataURL(base64字符串)转换为Blob对象（二进制大对象）
 * @param {String} dataUrl base64字符串
 * @return {Blob}
 */
util.dataURLtoBlob = function (dataUrl: string) {
  let arr = dataUrl.split(',');
  let mime = arr[0].match(/:(.*?);/)[1]; // 结果：   image/png
  // console.log("arr[0]====" + JSON.stringify(arr[0]));//   "data:image/png;base64"
  // console.log("arr[0].match(/:(.*?);/)====" + arr[0].match(/:(.*?);/));// :image/png;,image/png
  // console.log("arr[0].match(/:(.*?);/)[1]====" + arr[0].match(/:(.*?);/)[1]);//   image/png
  let bstr = atob(arr[1].replace(/\s/g, ''));
  let n = bstr.length;
  let u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], {type: mime}); // 值，类型
};

export default util;
