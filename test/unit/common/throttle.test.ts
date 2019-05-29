import {assert} from 'chai';
import {throttle} from '../../../src/common/throttle';

describe('功能 验证', function () {
  it('暴露接口验证', function () {
    assert.isFunction(throttle);
  });

  it('直接执行', function () {
    let num = 0;
    const func = function () {
      num++;
    };
    for (let i = 0; i < 100; i++) {
      func();
    }
    assert.equal(num, 100);
  });
});

describe('参数 验证', function () {
  it('不传参数', function (done) {
    let num = 0;
    const func = function () {
      num++;
    };
    const func2 = throttle(func);
    assert.equal(num, 0, '开始不执行');
    for (let i = 0; i < 100; i++) {
      func2();
    }
    assert.equal(num, 1, '不传递参数，执行一次');
    setTimeout(function () {
        assert.equal(num, 1, '时间不到，还是只有1次');
      },
      200);
    setTimeout(function () {
        assert.equal(num, 2, '函数执行了2次，开始一次，结果一次');
        done();
      },
      400);
  });
  it('参数为 leading=false', function (done) {
    let num = 0;
    const func = function () {
      num++;
    };
    const func2 = throttle(func, 300, {leading: false});
    assert.equal(num, 0, '开始不执行');
    for (let i = 0; i < 100; i++) {
      func2();
    }
    assert.equal(num, 0, '也不执行');
    setTimeout(function () {
        assert.equal(num, 0, '不到300秒，函数没有执行');
      },
      200);
    setTimeout(function () {
        assert.equal(num, 1, '函数执行了1次');
        done();
      },
      400);
  });

  it('参数为 trailing=false', function (done) {
    let num = 0;
    const func = function () {
      num++;
    };
    const func2 = throttle(func, 300, {trailing: false});
    assert.equal(num, 0, '开始不执行');
    for (let i = 0; i < 100; i++) {
      func2();
      if (i == 0) {
        assert.equal(num, 1, '结尾时会执行一次');
      }
    }
    assert.equal(num, 1, '结尾时会执行一次');
    setTimeout(function () {
        assert.equal(num, 1, '函数执行了1次');
      },
      200);
    setTimeout(function () {
        assert.equal(num, 1, '函数执行了1次');
        done();
      },
      400);
  });

});
