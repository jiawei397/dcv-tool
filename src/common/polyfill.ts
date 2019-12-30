if (!Object.values) {
  Object.values = function (obj) {
    if (obj !== Object(obj)) {
      throw new TypeError('Object.values called on a non-object');
    }
    let val = [], key;
    for (key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        val.push(obj[key]);
      }
    }
    return val;
  };
}
// String 扩展原型方法
if (!String.prototype.startsWith) {
  String.prototype.startsWith = function (k) {
    return this.substring(0, k.length) == k;
  };
}
if (!String.prototype.endsWith) {
  String.prototype.endsWith = function (k) {
    return this.substring(this.length - k.length) == k;
  };
}

if (!String.prototype.trim) {
  String.prototype.trim = function () {
    return this.replace(/^\s*|\s*$/g, '');
  };
}

if (!String.prototype.includes) {
  String.prototype.includes = function (search, start) {
    if (typeof start !== 'number') {
      start = 0;
    }
    if (start + search.length > this.length) {
      return false;
    }
    return this.indexOf(search, start) !== -1;
  };
}

// https://tc39.github.io/ecma262/#sec-array.prototype.includes
if (!Array.prototype.includes) {
  Object.defineProperty(Array.prototype, 'includes', {
    value: function (searchElement, fromIndex) {
      if (this == null) {
        throw new TypeError('"this" is null or not defined');
      }

      // 1. Let O be ? ToObject(this value).
      let o = Object(this);

      // 2. Let len be ? ToLength(? Get(O, "length")).
      let len = o.length >>> 0;

      // 3. If len is 0, return false.
      if (len === 0) {
        return false;
      }

      // 4. Let n be ? ToInteger(fromIndex).
      //    (If fromIndex is undefined, this step produces the value 0.)
      let n = fromIndex | 0;

      // 5. If n ≥ 0, then
      //  a. Let k be n.
      // 6. Else n < 0,
      //  a. Let k be len + n.
      //  b. If k < 0, let k be 0.
      let k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

      function sameValueZero(x, y) {
        return x === y || (typeof x === 'number' && typeof y === 'number' && isNaN(x) && isNaN(y));
      }

      // 7. Repeat, while k < len
      while (k < len) {
        // a. Let elementK be the result of ? Get(O, ! ToString(k)).
        // b. If SameValueZero(searchElement, elementK) is true, return true.
        if (sameValueZero(o[k], searchElement)) {
          return true;
        }
        // c. Increase k by 1.
        k++;
      }

      // 8. Return false
      return false;
    }
  });
}

if (!Array.prototype.fill) {
  Object.defineProperty(Array.prototype, 'fill', {
    value: function (value) {

      // Steps 1-2.
      if (this == null) {
        throw new TypeError('this is null or not defined');
      }

      let O = Object(this);

      // Steps 3-5.
      let len = O.length >>> 0;

      // Steps 6-7.
      let start = arguments[1];
      let relativeStart = start >> 0;

      // Step 8.
      let k = relativeStart < 0 ?
        Math.max(len + relativeStart, 0) :
        Math.min(relativeStart, len);

      // Steps 9-10.
      let end = arguments[2];
      let relativeEnd = end === undefined ?
        len : end >> 0;

      // Step 11.
      let final = relativeEnd < 0 ?
        Math.max(len + relativeEnd, 0) :
        Math.min(relativeEnd, len);

      // Step 12.
      while (k < final) {
        O[k] = value;
        k++;
      }

      // Step 13.
      return O;
    }
  });
}

if (!Array.from) {
  Array.from = (function () {
    let toStr = Object.prototype.toString;
    let isCallable = function (fn) {
      return typeof fn === 'function' || toStr.call(fn) === '[object Function]';
    };
    let toInteger = function (value) {
      let num = Number(value);
      if (isNaN(num)) {
        return 0;
      }
      if (num === 0 || !isFinite(num)) {
        return num;
      }
      return (num > 0 ? 1 : -1) * Math.floor(Math.abs(num));
    };
    let maxSafeInteger = Math.pow(2, 53) - 1;
    let toLength = function (value) {
      let len = toInteger(value);
      return Math.min(Math.max(len, 0), maxSafeInteger);
    };

    // The length property of the from method is 1.
    return function from(arrayLike/*, mapFn, thisArg */) {
      // 1. Let C be the this value.
      let C = this;

      // 2. Let items be ToObject(arrayLike).
      let items = Object(arrayLike);

      // 3. ReturnIfAbrupt(items).
      if (arrayLike == null) {
        throw new TypeError('Array.from requires an array-like object - not null or undefined');
      }

      // 4. If mapfn is undefined, then let mapping be false.
      let mapFn = arguments.length > 1 ? arguments[1] : undefined;
      let T;
      if (typeof mapFn !== 'undefined') {
        // 5. else
        // 5. a If IsCallable(mapfn) is false, throw a TypeError exception.
        if (!isCallable(mapFn)) {
          throw new TypeError('Array.from: when provided, the second argument must be a function');
        }

        // 5. b. If thisArg was supplied, let T be thisArg; else let T be undefined.
        if (arguments.length > 2) {
          T = arguments[2];
        }
      }

      // 10. Let lenValue be Get(items, "length").
      // 11. Let len be ToLength(lenValue).
      let len = toLength(items.length);

      // 13. If IsConstructor(C) is true, then
      // 13. a. Let A be the result of calling the [[Construct]] internal method
      // of C with an argument list containing the single item len.
      // 14. a. Else, Let A be ArrayCreate(len).
      let A = isCallable(C) ? Object(new C(len)) : new Array(len);

      // 16. Let k be 0.
      let k = 0;
      // 17. Repeat, while k < len… (also steps a - h)
      let kValue;
      while (k < len) {
        kValue = items[k];
        if (mapFn) {
          A[k] = typeof T === 'undefined' ? mapFn(kValue, k) : mapFn.call(T, kValue, k);
        } else {
          A[k] = kValue;
        }
        k += 1;
      }
      // 18. Let putStatus be Put(A, "length", len, true).
      A.length = len;
      // 20. Return A.
      return A;
    };
  }());
}

if (!Array.of) {
  Array.of = function () {
    return Array.prototype.slice.call(arguments);
  };
}

// https://tc39.github.io/ecma262/#sec-array.prototype.findIndex
if (!Array.prototype.findIndex) {
  Object.defineProperty(Array.prototype, 'findIndex', {
    value: function (predicate) {
      // 1. Let O be ? ToObject(this value).
      if (this == null) {
        throw new TypeError('"this" is null or not defined');
      }

      let o = Object(this);

      // 2. Let len be ? ToLength(? Get(O, "length")).
      let len = o.length >>> 0;

      // 3. If IsCallable(predicate) is false, throw a TypeError exception.
      if (typeof predicate !== 'function') {
        throw new TypeError('predicate must be a function');
      }

      // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
      let thisArg = arguments[1];

      // 5. Let k be 0.
      let k = 0;

      // 6. Repeat, while k < len
      while (k < len) {
        // a. Let Pk be ! ToString(k).
        // b. Let kValue be ? Get(O, Pk).
        // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
        // d. If testResult is true, return k.
        let kValue = o[k];
        if (predicate.call(thisArg, kValue, k, o)) {
          return k;
        }
        // e. Increase k by 1.
        k++;
      }

      // 7. Return -1.
      return -1;
    }
  });
}

// https://tc39.github.io/ecma262/#sec-array.prototype.find
if (!Array.prototype.find) {
  Object.defineProperty(Array.prototype, 'find', {
    value: function (predicate) {
      // 1. Let O be ? ToObject(this value).
      if (this == null) {
        throw new TypeError('"this" is null or not defined');
      }

      let o = Object(this);

      // 2. Let len be ? ToLength(? Get(O, "length")).
      let len = o.length >>> 0;

      // 3. If IsCallable(predicate) is false, throw a TypeError exception.
      if (typeof predicate !== 'function') {
        throw new TypeError('predicate must be a function');
      }

      // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
      let thisArg = arguments[1];

      // 5. Let k be 0.
      let k = 0;

      // 6. Repeat, while k < len
      while (k < len) {
        // a. Let Pk be ! ToString(k).
        // b. Let kValue be ? Get(O, Pk).
        // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
        // d. If testResult is true, return kValue.
        let kValue = o[k];
        if (predicate.call(thisArg, kValue, k, o)) {
          return kValue;
        }
        // e. Increase k by 1.
        k++;
      }

      // 7. Return undefined.
      return undefined;
    }
  });
}

/**
 * 获取数组最后一个元素
 */
Object.defineProperty(Array.prototype, 'last', {
  value: function () {
    // 1. Let O be ? ToObject(this value).
    if (this == null) {
      throw new TypeError('"this" is null or not defined');
    }

    return this.slice(-1)[0];
  }
});

/**
 * 重写Number的toFixed方法
 */
Number.prototype.toFixed = function (n: number) {
  if (n > 20 || n < 0) {
    throw new RangeError('toFixed() digits argument must be between 0 and 20');
  }
  const num = this;
  if (isNaN(num) || num >= Math.pow(10, 21)) {
    return num.toString();
  }
  if (typeof (n) == 'undefined' || n == 0) {
    return (Math.round(num)).toString();
  }

  let result = num.toString();
  const arr = result.split('.');

  // 整数的情况
  if (arr.length < 2) {
    result += '.';
    for (let i = 0; i < n; i += 1) {
      result += '0';
    }
    return result;
  }

  const integer = arr[0];
  const decimal = arr[1];
  if (decimal.length == n) {
    return result;
  }
  if (decimal.length < n) {
    for (let i = 0; i < n - decimal.length; i += 1) {
      result += '0';
    }
    return result;
  }
  result = integer + '.' + decimal.substr(0, n);
  const last = decimal.substr(n, 1);

  // 四舍五入，转换为整数再处理，避免浮点数精度的损失
  if (parseInt(last, 10) >= 5) {
    const x = Math.pow(10, n);
    result = (Math.round((parseFloat(result) * x)) + 1) / x;
    result = result.toFixed(n);
  }

  return result;
};

// jw 2017.11.06 兼容window.requestAnimationFrame
(function (window: any) {
  if (!window) {
    return;
  }
  let lastTime = 0;
  let vendors = ['webkit', 'moz'];
  for (let x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
    window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
  }

  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = function (callback) {
      let currTime = new Date().getTime();
      let timeToCall = Math.max(0, 16 - (currTime - lastTime));
      let id = window.setTimeout(function () {
          callback(currTime + timeToCall);
        },
        timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };
  }

  if (!window.cancelAnimationFrame) {
    window.cancelAnimationFrame = function (id) {
      clearTimeout(id);
    };
  }
})(typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : null));

/*******************************************************************************
 * 以下非js原生函数
 ******************************************************************************/
if (!String.prototype.hasOwnProperty('replaceAll')) {
  (String.prototype as any).replaceAll = function (s1, s2) {
    let r = new RegExp(s1.replace(/([\(\)\[\]\{\}\^\$\+\-\*\?\.\"\'\|\/\\])/g,
      '\\$1'), 'ig');
    return this.replace(r, s2);
  };
}
if (!String.prototype.hasOwnProperty('has')) {
  (String.prototype as any).has = String.prototype.includes;
}

// 说明：JS时间Date格式化参数
// 参数：格式化字符串如：'yyyy-MM-dd HH:mm:ss'
// 结果：如2016-06-01 10:09:00
if (!(Date.prototype as any).format) {
  (Date.prototype as any).format = function (fmt) {
    let o = {
      'M+': this.getMonth() + 1,
      'd+': this.getDate(),
      'H+': this.getHours(),
      'm+': this.getMinutes(),
      's+': this.getSeconds(),
      'q+': Math.floor((this.getMonth() + 3) / 3),
      'S': this.getMilliseconds()
    };
    let year = this.getFullYear();
    let yearstr = year + '';
    yearstr = yearstr.length >= 4 ? yearstr : '0000'.substr(0, 4 - yearstr.length) + yearstr;

    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (yearstr + '').substr(4 - RegExp.$1.length));
    }
    for (let k in o) {
      if (new RegExp('(' + k + ')').test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
      }
    }
    return fmt;
  };
}

export default Object;
