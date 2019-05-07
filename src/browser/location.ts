const local: any = {};
/**
 * 获取参数
 * @example '?name=07'
 */
local.getSearch = function (win: Window = window) {
  return win.location.search;
};

/**
 * url中除ip和参数外的地址
 * @example '/tarsier-vmdb/dcvWeb/dcv/list.html'
 */
local.getPathName = function (win: Window = window) {
  return win.location.pathname;
};

/**
 * ip和端口
 * @example localhost:63342
 */
local.getHost = function (win: Window = window) {
  return win.location.host;
};

/**
 * 当前 URL 的协议
 * @example http:
 */
local.getProtocol = function (win: Window = window) {
  return win.location.protocol;
};

/**
 * 获取hash值
 * @example #a=1
 */
local.getHash = function (win: Window = window) {
  return win.location.hash;
};

/**
 * 浏览器标识
 * @example Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36
 */
local.getUserAgent = function (win: Window = window) {
  return win.navigator.userAgent;
};

/**
 * 用户屏幕的信息
 */
local.getScreen = function (win: Window = window) {
  return win.screen;
};

/**
 * 浏览器缩放比例
 * 低版本IE没有
 * @example 1.25
 */
local.getDevicePixelRatio = function (win: Window = window) {
  return win.devicePixelRatio;
};

/**
 * 浏览器内外宽度
 */
local.getWindowWidth = function (win: Window = window) {
  return {
    outerWidth: win.outerWidth,
    innerWidth: win.innerWidth
  };
};

export default local;
