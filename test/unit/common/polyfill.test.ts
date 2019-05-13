import {assert, expect} from 'chai';

describe('polyfill 验证', function () {
  Object.values = null;
  String.prototype.startsWith = null;
  String.prototype.endsWith = null;
  String.prototype.trim = null;
  String.prototype.includes = null;
  Array.prototype.includes = null;
  require('../../../src/common/polyfill');

  it('Object.values 验证', function () {
    let obj = {'a': 1, 'b': 2};
    let arr = Object.values(obj);
    assert.isArray(arr);
    assert.equal(arr.length, 2);
    assert.deepEqual(arr, [1, 2]);
  });

  it('String.prototype.startsWith 验证', function () {
    let str = 'abc123';
    assert.isTrue(str.startsWith('a'));
    assert.isTrue(str.startsWith('ab'));
    assert.isTrue(str.startsWith('abc'));
    assert.isFalse(str.startsWith('d'));
  });

  it('String.prototype.endsWith 验证', function () {
    let str = 'abc123';
    assert.isTrue(str.endsWith('3'));
    assert.isTrue(str.endsWith('23'));
    assert.isTrue(str.endsWith('123'));
    assert.isFalse(str.endsWith('d'));
  });

  it('String.prototype.trim 验证', function () {
    let str = ' abc ';
    assert.equal(str.trim(), 'abc');
  });

  it('String.prototype.replaceAll 验证', function () {
    let str: any = 'a1a2a3';
    let result = str.replaceAll('a', 'b');
    assert.equal(result, 'b1b2b3');
  });

  it('String.prototype.includes 验证', function () {
    let str = 'a1a2a3';
    assert.isTrue(str.includes('a'));
    assert.isTrue(str.includes('a1'));
    assert.isTrue(str.includes('a2'));
    assert.isTrue(str.includes('a3'));
    assert.isFalse(str.includes('abc'));
  });

  it('Array.prototype.includes 验证', function () {
    let arr = ['a', 'b', 'c'];
    assert.isTrue(arr.includes('a'));
    assert.isTrue(arr.includes('b'));
    assert.isTrue(arr.includes('c'));
    assert.isFalse(arr.includes('abc'));
  });

  it('Number.prototype.toFixed 验证', function () {
    let num: number = 1.123;
    assert.equal(num.toFixed(2), '1.12');
    assert.equal(num.toFixed(1), '1.1');
    assert.isString(num.toFixed(0), '结果是个字符串');

    let num2: number = 1.155;
    assert.equal(num2.toFixed(2), '1.16');
    assert.equal(num2.toFixed(1), '1.2');

    let num3 = Math.pow(10, 21);
    assert.equal(num3.toFixed(1), '1e+21');

    num3 += 1;
    assert.equal(num3.toFixed(1), '1e+21', '超过最大值，不会有变化');
    assert.equal(num3.toFixed(2), '1e+21', '超过最大值，不会有变化');
  });
});
