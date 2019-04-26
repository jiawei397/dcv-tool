const local:any = {};
/**
 * 获取参数
 * @example '?name=07'
 */
local.getSearch = function (win) {
  if (!win || !(win instanceof Window)) {
    win = window;
  }
  return win.local.search;
};

/**
 * url中除ip和参数外的地址
 * @example '/tarsier-vmdb/dcvWeb/dcv/list.html'
 */
local.getPathName = function () {
  return window.location.pathname;
};

/**
 * ip和端口
 * @example localhost:63342
 */
local.getHost = function () {
  return window.location.host;
};

/**
 * 当前 URL 的协议
 * @example http:
 */
local.getProtocol = function () {
  return window.location.protocol;
};

/**
 * 获取hash值
 * @example #a=1
 */
local.getHash = function () {
  return window.location.hash;
};

/**
 * 浏览器标识
 * @example Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36
 */
local.getUserAgent = function () {
  return window.navigator.userAgent;
};

/**
 * 用户屏幕的信息
 **/
local.getScreen = function () {
  return window.screen;
};

/**
 * 浏览器缩放比例
 * 低版本IE没有
 * @example 1.25
 */
local.getDevicePixelRatio = function () {
  return window.devicePixelRatio;
};

/**
 * 浏览器内外宽度
 */
local.getWindowWidth = function () {
  return {
    outerWidth: window.outerWidth,
    innerWidth: window.innerWidth
  };
};

export default local;
