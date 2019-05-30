import {assert} from 'chai';
import util from '../../../src/browser/util';
// import {JSDOM } from 'jsdom';

const window = global as any;
window.navigator = {};
window.location = {};
let ua = '';
Object.defineProperty(window.navigator, 'userAgent', {
  get: () => ua
});

let search = '?code=0701', hash = 'name=123', pathname = '/dcv-tool/a.html', host = 'localhost:8080',
  hostname = 'localhost', protocol = 'http:';
Object.defineProperties(window.location, {
  search: {
    get: () => search
  },
  hash: {
    get: () => hash
  },
  pathname: {
    get: () => pathname
  },
  host: {
    get: () => host
  },
  protocol: {
    get: () => protocol
  }
});

let devicePixelRatio, outerWidth, readyState, attr;
let createEle: any = () => {
  return {
    type: '',
    readyState: readyState,
    src: ''
  };
};

let xhrReadyState = 0; //控制XMLHttpRequest状态值
let xhrStatus = 0; //控制XMLHttpRequest状态码

//模拟一个xhr类
class XMLHttpRequest {
  public readyState: number = xhrReadyState;
  public status: number = xhrStatus;

  constructor() {

  }

  public open() {

  }

  public send() {

  }
}

Object.defineProperties(window, {
  screen: {
    get: () => {
      return {
        deviceXDPI: 12,
        logicalXDPI: 20
      };
    }
  },
  devicePixelRatio: {
    get: () => devicePixelRatio
  },
  outerWidth: {
    get: () => outerWidth
  },
  innerWidth: {
    get: () => 20
  },
  document: {
    get: () => {
      return {
        body: {
          appendChild: () => {
          }
        },
        createElement: () => {
          let ele = createEle();
          setTimeout(() => {
            if (ele.onreadystatechange) {
              ele.onreadystatechange();
            } else if (ele.onload) {
              ele.onload();
            }
          }, 100);
          return ele;
        },
        getElementsByTagName: () => {
          return [{
            appendChild: () => {
            },
            removeChild: () => {

            },
            getAttribute: () => attr
          }];
        }
      };
    }
  },
  XMLHttpRequest: {
    get: () => XMLHttpRequest
  }
});

describe('页面util 验证', function () {
  it('判断当前浏览器 校验', function () {
    ua = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36'; //32位chrome
    assert.isFalse(util.is64());
    assert.isFalse(util.isIE());
    assert.isTrue(util.isChrome(), '32位chrome');

    ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36'; //64位chrome
    assert.isTrue(util.is64());
    assert.isFalse(util.isIE());
    assert.isTrue(util.isChrome(), '64位chrome');

    ua = 'Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; .NET4.0C; .NET4.0E; Zoom 3.6.0; rv:11.0) like Gecko';
    assert.isFalse(util.is64(), '这是32位IE');
    assert.isTrue(util.isIE(), '是IE');
    assert.isFalse(util.isChrome());

    ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; Trident/7.0; .NET4.0C; .NET4.0E; Zoom 3.6.0; rv:11.0) like Gecko';
    assert.isTrue(util.is64(), '这是64位IE');
    assert.isTrue(util.isIE(), '是IE');
    assert.isFalse(util.isChrome());

    ua = 'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 10.0; Win64; x64; Trident/7.0; .NET4.0C; .NET4.0E; Zoom 3.6.0)';
    assert.isTrue(util.is64(), 'IE9');
    assert.isTrue(util.isIE(), 'IE9');
    assert.isFalse(util.isChrome());

    ua = 'Mozilla/5.0 (Windows; U; Windows NT 5.2) AppleWebKit/525.13 (KHTML, like Gecko) Version/3.1 Safari/525.13';
    assert.isFalse(util.is64(), '这是32位Safari浏览器');
    assert.isFalse(util.isIE());
    assert.isFalse(util.isChrome());
  });

  it('判断当前浏览器缩放 校验', function () {
    devicePixelRatio = 100;
    assert.isNumber(util.detectZoom(), '浏览器缩放比例');

    devicePixelRatio = undefined;
    ua = 'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 10.0; Win64; x64; Trident/7.0; .NET4.0C; .NET4.0E; Zoom 3.6.0)';
    assert.isNumber(util.detectZoom(), '测试低版本IE');
    assert.equal(util.detectZoom(), 12 / 20, '浏览器缩放比例');

    ua = '';
    outerWidth = 10;
    assert.isNumber(util.detectZoom(), '浏览器缩放比例');
    assert.equal(util.detectZoom(), 1 / 2, '浏览器缩放比例');

    outerWidth = undefined;
    assert.isNumber(util.detectZoom(), '浏览器缩放比例');
  });

  it('获取url后面参数 校验', function () {
    let result = util.urlArg('abc');
    assert.isNull(result);

    assert.isString(util.urlArg('code'));
    assert.equal(util.urlArg('code'), '0701');

    let map = util.getURLParamsMap(window);
    assert.equal(map.code, '0701');

    let code = util.getURLParams('code', window);
    assert.isString(code);
    assert.equal(code, '0701');
  });

  it('getProjectName 校验', function () {
    assert.isString(util.getProjectName());
    assert.equal(util.getProjectName(), 'dcv-tool');

    let originPathName = pathname;
    pathname = '';
    assert.equal(util.getProjectName(), '');

    pathname = '123';
    assert.equal(util.getProjectName(), '');

    pathname = originPathName;
  });

  it('getIp 校验', function () {
    assert.isString(util.getIp());
    assert.include(util.getIp(), protocol);
    assert.include(util.getIp(), host);

    let originHost = host;
    host = '';
    assert.equal(util.getIp(), '');

    host = originHost;
  });

  it('loadScript 校验', function (done) {
    let url = '/base/data/empty.js';
    util.loadScript(url);

    util.loadScript(url, function () {
      assert.isOk(url, '没有readyState，这句会被调用');
    });

    readyState = 'loaded';
    util.loadScript(url, function () {
      assert.isOk(url, '这句会被调用');
    });

    readyState = 'complete';
    util.loadScript(url, function () {
      assert.isOk(url, '这句会被调用');
      done();
    });
  });

  it('requireCss 校验', function () {
    assert.isFunction(util.requireCss);
    util.requireCss('style.css');
    util.requireCss('style.css', 'aa');
    util.requireCss('style.css', 'aa', 'box');
  });

  it('setFavicon 校验', function () {
    assert.isFunction(util.removeFavicon);
    util.removeFavicon('aa.icon');

    attr = 'icon';
    util.removeFavicon('aa.icon');

    assert.isFunction(util.setFavicon);
    util.setFavicon('aa.icon');
  });

  it('isFileExist  校验', function (done) {
    assert.isFunction(util.isFileExist);
    let url = 'https://www.baidu.com';
    util.isFileExist(url);
    setTimeout(() => {
      xhrReadyState = 4;
      xhrStatus = 205;
      util.isFileExist(url);
    }, 100);
    setTimeout(() => {
      xhrStatus = 304;
      let result = util.isFileExist(url);
      assert.isBoolean(result, '返回结果一定是boolean');
      done();
    }, 200);
  });

  it('增加一个参数到Url中 addParam2Url() 校验', function () {
    let url1 = 'https://www.baidu.com?hello=001';
    let url2 = 'https://www.baidu.com?hello=001&good=000';
    let url3 = 'https://www.baidu.com';
    assert.equal(util.addParam2Url(url1, 'one', '001'), 'https://www.baidu.com?hello=001&one=001');
    assert.equal(util.addParam2Url(url2, 'two', '002'), 'https://www.baidu.com?hello=001&good=000&two=002');
    assert.equal(util.addParam2Url(url3, 'one', '001'), 'https://www.baidu.com?one=001');
  });

  it('移出一个url参数 removeParamFromUrl() 校验', function () {
    let url1 = 'https://www.baidu.com';
    let url2 = 'https://www.baidu.com?hello=001&good=000';
    assert.equal(util.removeParamFromUrl(url1, 'one'), url1);
    assert.equal(util.removeParamFromUrl(url2, 'hello'), 'https://www.baidu.com?good=000');
  });

  it('hash值 校验', function () {
    assert.isUndefined(util.getHashByKey('abcd'));

    let map = util.getHashMap();
    assert.isObject(map);

    hash = '#a=1';
    map = util.getHashMap();
    assert.equal(map.a, '1');
    assert.equal(util.getHashByKey('a'), '1');

    hash = '#cosmos';
    map = util.getHashMap();
    assert.isObject(map);
    assert.equal(map.cosmos, 'undefined');
    assert.equal(util.getHashByKey('cosmos'), 'undefined');

    hash = '#func=uinv.u3d.funcSet.setSelectionRootObjByBID("172.17.10.143","123##323")&token=53cf50b38d9ad7318ad83e89c37eab6f7e357e45ae74b78a412ac03ef999e858caa5a5e6d7904fa20db13e1d49f3a74da6428d1d24392327a32fa5154e10f45c';
    map = util.getHashMap();
    assert.isObject(map);
    assert.isNotEmpty(map, '这时map不是空');
    assert.isDefined(map.func, 'func取到了');
    assert.isDefined(map.token, 'token也取到了');

    hash = '';
    map = util.getHashMap();
    assert.isObject(map);
    assert.isEmpty(map);
  });
});
