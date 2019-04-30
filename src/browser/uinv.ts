import uinv from '../common/index';

/**
 * 封装的localStorage和sessionStorage方法
 * @private
 * @author jw
 * @date 2017-08-02
 */
let data = function (storage: Storage, key: string, value: any) {
  if (key === undefined) {
    return null;
  }
  if (value === undefined) {
    return uinv.jsonParse(storage.getItem(key));
  } else if (value == null) {
    storage.removeItem(key);
  } else {
    storage.setItem(key, uinv.stringify(value));
  }
  return uinv;
};

/**
 * 封装localStorage方法
 */
uinv.data = function (key: string, value: any) {
  return data(localStorage, key, value);
};

/**
 * 封装sessionStorage方法
 */
uinv.sessionStorage = function (key, value) {
  return data(sessionStorage, key, value);
};

/**
 * 获取所有cookie
 * @author jw
 * @date 2017-09-27
 */
uinv.getAllCookie = function () {
  return document.cookie;
};

/**
 * 获取cookie
 * @author jw
 * @date 2017-09-27
 */
const getCookie = function (name: string) {
  var reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)'), arr = document.cookie.match(reg);
  if (arr) {
    return unescape(arr[2]);
  }
  return null;
};

/**
 * 删除cookie
 * @author jw
 * @date 2017-09-27
 */
const delCookie = function (name: string) {
  var cval = getCookie(name);
  if (cval != null) {
    setCookie(name, '', -1);
  }
};

/**
 * 设置cookie
 * @author jw
 * @date 2017-09-27
 */
const setCookie = function (name: string, value: string, days: number = 300) {
  var exp = new Date();
  exp.setTime(exp.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = name + '=' + escape(value) + '; path=/;expires=' + exp.toUTCString();
};

/**
 * 封装cookie方法
 */
uinv.cookie = function (key: string, value: any, days: number) {
  if (key === undefined) {
    return null;
  }
  if (value === undefined) {
    return uinv.jsonParse(getCookie(key));
  } else if (value == null) {
    delCookie(key);
  } else {
    setCookie(key, uinv.stringify(value), days);
  }
  return uinv;
};

uinv.importJs = function (path: string) {
  document.write(`<script type='text/javascript' src='${path}'></script>`);
};

uinv.importCss = function (path: string) {
  document.write(`<link rel='STYLESHEET' type='text/css' href='${path}'>`);
};

export default uinv;