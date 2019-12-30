import {assert} from 'chai';
import utils from '../../../src/browser/utils';

const lsMap = {}, ssMap = {};
let cookieMap = {};
const window = global as any;
window.document = {};
Object.defineProperties(window, {
  localStorage: {
    get: () => {
      return {
        getItem: (key) => {
          let val = lsMap[key];
          if (typeof val !== 'string') {
            return val;
          }
          return JSON.parse(val);
        },
        setItem: (key, value) => {
          lsMap[key] = JSON.stringify(value);
        },
        removeItem: (key) => {
          delete lsMap[key];
        }
      };
    }
  },
  sessionStorage: {
    get: () => {
      return {
        getItem: (key) => {
          let val = ssMap[key];
          if (typeof val !== 'string') {
            return val;
          }
          return JSON.parse(val);
        },
        setItem: (key, value) => {
          ssMap[key] = JSON.stringify(value);
        },
        removeItem: (key) => {
          delete ssMap[key];
        }
      };
    }
  }
});
Object.defineProperty(window.document, 'cookie', {
  get: () => {
    let str = '';
    for (let key in cookieMap) {
      str += key + '=' + cookieMap[key] + ';';
    }
    return str;
  },
  set: (str) => {
    if (!str) {
      cookieMap = {};
      return;
    }
    let arr = str.split(';');
    let map = {};
    let key, value;
    arr.forEach((str2, index) => {
      let array = str2.split('=');
      if (index === 0) {
        key = array[0];
        value = array[1];
      }
      map[array[0]] = array[1];
    });
    if (map['expires'] == -1) {
      delete cookieMap[key];
      return;
    }
    cookieMap[key] = value;
  }
});

Object.defineProperty(window.document, 'write', {
  get: () => {
    return (str) => {
      console.log(`document write ${str}`);
    };
  }
});

describe('页面uinv 验证', function () {
  it('封装localStorage方法 utils.data() 校验', function () {
    assert.isNull(utils.data());

    utils.data('nico', 'hello');
    assert.equal(localStorage.getItem('nico'), 'hello', '测试设置');

    utils.data('abc', {'a': 'b'});
    let data = utils.data('abc');
    assert.isObject(data, '返回的是解析过的json');
    assert.equal(data.a, 'b');

    assert.equal(utils.data('nico'), 'hello');
    utils.data('nico', null);
    assert.equal(localStorage.getItem('nico'), undefined);
  });

  it('封装sessionStorage方法 utils.sessionStorage() 校验', function () {
    utils.sessionStorage('leo', 'good');
    assert.equal(window.sessionStorage.getItem('leo'), 'good');
    assert.equal(utils.sessionStorage('leo'), 'good');
    utils.sessionStorage('leo', null);
    assert.equal(window.sessionStorage.getItem('leo'), undefined);
  });

  it('封装cookie方法 utils.cookie() 校验', function () {
    document.cookie = '';
    assert.isNull(utils.cookie(), '不传递Key值会返回null');
    utils.cookie('hello', 'world', '测试设置');
    assert.include(document.cookie, 'hello=world');
    assert.equal(utils.cookie('hello'), 'world', '测试获取');
    utils.cookie('hello', null, '这时没有hello这个cookie了，测试删除');
    assert.notInclude(document.cookie, 'hello=world');
    assert.isNull(utils.cookie(), '不传递参数时，返回Null');
  });

  it('获取所有cookie getAllCookie() 校验', function () {
    document.cookie = '';
    utils.cookie('cat', 'tom');
    utils.cookie('mouse', 'jerry');
    let allCookie = utils.getAllCookie();
    assert.include(allCookie, 'cat=tom');
    assert.include(allCookie, 'mouse=jerry');
  });

  it('importJs () 校验', function () {
    assert.isFunction(utils.importJs);
    assert.isUndefined(utils.importJs('/a/b.js'), '没有返回值');
  });

  it('importCss () 校验', function () {
    assert.isFunction(utils.importCss);
    assert.isUndefined(utils.importCss('/a/b.css'), '没有返回值');
  });

});
