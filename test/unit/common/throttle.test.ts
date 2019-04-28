import {assert, expect} from 'chai';
import throttle from '../../../src/common/throttle';

describe('throttle 验证', function () {
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

  it('延时验证', function (done) {
    let num = 0;
    const func = function () {
      num++;
    };
    for (let i = 0; i < 100; i++) {
      throttle(func);
    }
    assert.equal(num, 0);
    setTimeout(function () {
      assert.equal(num, 1, '过上一秒，函数只执行了一次');
      done();
    }, 1000);
  });


});
