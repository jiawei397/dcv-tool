import {assert} from 'chai';
import uinv from '../../../src/browser/uinv';

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
  it('封装localStorage方法 uinv.data() 校验', function () {
    assert.isNull(uinv.data());

    uinv.data('nico', 'hello');
    assert.equal(localStorage.getItem('nico'), 'hello', '测试设置');

    uinv.data('abc', {'a': 'b'});
    let data = uinv.data('abc');
    assert.isObject(data, '返回的是解析过的json');
    assert.equal(data.a, 'b');

    assert.equal(uinv.data('nico'), 'hello');
    uinv.data('nico', null);
    assert.equal(localStorage.getItem('nico'), undefined);
  });

  it('封装sessionStorage方法 uinv.sessionStorage() 校验', function () {
    uinv.sessionStorage('leo', 'good');
    assert.equal(window.sessionStorage.getItem('leo'), 'good');
    assert.equal(uinv.sessionStorage('leo'), 'good');
    uinv.sessionStorage('leo', null);
    assert.equal(window.sessionStorage.getItem('leo'), undefined);
  });

  it('封装cookie方法 uinv.cookie() 校验', function () {
    document.cookie = '';
    assert.isNull(uinv.cookie(), '不传递Key值会返回null');
    uinv.cookie('hello', 'world', '测试设置');
    assert.include(document.cookie, 'hello=world');
    assert.equal(uinv.cookie('hello'), 'world', '测试获取');
    uinv.cookie('hello', null, '这时没有hello这个cookie了，测试删除');
    assert.notInclude(document.cookie, 'hello=world');
    assert.isNull(uinv.cookie(), '不传递参数时，返回Null');
  });

  it('获取所有cookie getAllCookie() 校验', function () {
    document.cookie = '';
    uinv.cookie('cat', 'tom');
    uinv.cookie('mouse', 'jerry');
    let allCookie = uinv.getAllCookie();
    assert.include(allCookie, 'cat=tom');
    assert.include(allCookie, 'mouse=jerry');
  });

  it('importJs () 校验', function () {
    assert.isFunction(uinv.importJs);
    assert.isUndefined(uinv.importJs('/a/b.js'), '没有返回值');
  });

  it('importCss () 校验', function () {
    assert.isFunction(uinv.importCss);
    assert.isUndefined(uinv.importCss('/a/b.css'), '没有返回值');
  });

});
