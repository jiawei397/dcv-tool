import {assert, expect} from 'chai';
import throttle from '../../../src/common/throttle';

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
      assert.equal(num, 1, '函数只执行了一次');
      done();
    }, 400);
  });
});

describe('参数 验证', function () {
  it('不同id', function (done) {
    let num = 0;
    const func = function () {
      num++;
    };
    for (let i = 0; i < 100; i++) {
      throttle(func, {
        id: i
      });
    }
    assert.equal(num, 0);
    setTimeout(function () {
      assert.equal(num, 100, '不同的函数其实执行了100次');
      done();
    }, 400);
  });

  it('不改变作用域', function (done) {
    let name;
    const func = function () {
      if (this) {
        name = this.name;
      }
    };
    throttle(func);
    setTimeout(function () {
      assert.isUndefined(name, '未定义');
      done();
    }, 400);
  });

  it('改变作用域', function (done) {
    let name;
    const func = function () {
      name = this.name;
    };
    const obj = {
      name: 'aa'
    };
    throttle(func, {
      context: obj
    });
    setTimeout(function () {
      assert.equal(name, 'aa');
      done();
    }, 400);
  });

  it('传递参数', function (done) {
    let name;
    const func = function (params) {
      name = params;
    };
    throttle(func, {
      args: [123]
    });
    setTimeout(function () {
      assert.equal(name, 123);
      done();
    }, 400);
  });

  // it('过期时间', function (done) {
  //   let num =0;
  //   const func = function () {
  //     num ++;
  //   };
  //   for (let i = 0; i < 100; i++) {
  //     throttle(func, {
  //       time: 200
  //     });
  //   }
  //   setTimeout(function () {
  //     assert.equal(num, 123);
  //     done();
  //   }, 400);
  // });

});
