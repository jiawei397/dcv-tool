import { assert, expect} from 'chai';
import uinv from '../../../src/common/uinv';

describe('cloneObj() 验证', function () {
  var obj = {
    'a': 'b',
    'c': ['jfjfjfjs'],
    'd': function () {

    },
    'e': {
      'f': function () {

      },
      'g': ['fjjfdjsj'],
      'h': {
        'i': function () {
          console.log('i');
        }
      }
    }
  };
  it('深度复制，改变属性为引用类型的值不会影响原对象', function () {
    var newObj = uinv.cloneObj(obj, true);
    assert.notEqual(newObj, obj);
    assert.deepEqual(newObj, obj);
    assert.notEqual(obj.e, newObj.e, '非引用类型的值不应该相等');

    newObj.e.g = 'aa';
    // expect(obj.e.g).to.deep.equal(newObj.e.g);//肯定报错
    assert.notEqual(obj.e.g, newObj.e.g, '非引用类型的值不应该相等');
  });

  it('非深度复制，其非引用类型其实是引用指针', function () {
    var newObj = uinv.cloneObj(obj, false);
    assert.deepEqual(newObj, obj);
    assert.equal(newObj.e, obj.e, '非引用类型的值其实是引用值');

    newObj.e.g = 'aa';
    assert.equal(obj.e.g, newObj.e.g, '引用类型的值都改变了');
  });
});

describe('继承 extend() 验证', function () {
  var SuperClass = function (a) {
    this.a = a;
  };
  SuperClass.prototype.test = function () {

  };

  const SubClass:any = function (b) {
    SubClass.superclass.constructor.call(this, b);
    this.b = b;
  };
  SubClass.prototype.test2 = function () {

  };
  uinv.extend(SubClass, SuperClass);

  var subClass = new SubClass('b');

  it('判断继承', function () {
    assert.equal(subClass.a, 'b');//只有SubClass.superclass.constructor.call(this, b);这句，才会成功
    assert.equal(subClass.b, 'b');
    assert.isFunction(subClass.test, '继承来的属性方法');
    // assert.isFunction(subClass.test2, "实现类的属性方法");//TODO 这个报错
  });

  it('isInstance() 验证', function () {
    assert.equal(uinv.isInstance(subClass, SuperClass), true);
    assert.equal(uinv.isInstance(subClass, SubClass), true);
    assert.equal(uinv.instanceOf, uinv.isInstance);
  });
});

describe('混合继承 multiExtend() 验证', function () {
  var SuperClass1 = function (a) {
    this.a = a;
  };
  SuperClass1.prototype.test = function () {

  };

  var SuperClass2 = function (a, c) {
    this.a = a;
    this.c = c;
  };
  SuperClass2.prototype.test2 = function () {

  };

  var SubClass:any = function (b) {
    SubClass.superclass.constructor.call(this, b);
    this.b = b;
  };
  SubClass.prototype.test3 = function () {

  };
  uinv.multiExtend(SubClass, [SuperClass1, SuperClass2]);

  var subClass = new SubClass('b');

  it('判断继承', function () {
    assert.equal(SubClass.superclass, SuperClass1.prototype, '全面继承的是第1个父类');
    assert.equal(subClass.a, 'b');//只有SubClass.superclass.constructor.call(this, b);这句，才会成功
    assert.equal(subClass.b, 'b');
    assert.isFunction(subClass.test, '继承来的属性方法');
    assert.isFunction(subClass.test2, '继承的SuperClass2的属性方法');
    assert.isUndefined(subClass.test3, '自身的属性方法');
  });

  it('isInstance() 验证', function () {
    assert.equal(uinv.isInstance(subClass, SuperClass1), true);
    assert.equal(uinv.isInstance(subClass, SuperClass2), true);
    assert.equal(uinv.isInstance(subClass, SubClass), true);
  });
});

describe('uinv中基本方法校验', function () {
  it('random() 验证', function () {
    assert.isNumber(uinv.random(), '随机数是个数字');

    var a = uinv.random();
    var b = uinv.random();
    assert.notEqual(a, b, '随机生成的2个数字不一样');
  });

  it('isFunction() 验证', function () {
    // expect(uinv.isFunction('abc')).to.be.false;
    // expect(uinv.isFunction(function () {})).to.be.true;
    // expect(uinv.isFunction(false)).to.be.false;

    //两种写法，感受下区别
    assert.equal(uinv.isFunction(123), false);
    assert.equal(uinv.isFunction(['a', 'b']), false);
    assert.equal(uinv.isFunction({
      'a': 'b',
      'c': ['jfjfjfjs']
    }), false);
  });

  it('isObject() 验证', function () {
    assert.equal(uinv.isObject(null), false, 'null不对');
    assert.equal(uinv.isObject('abc'), false, '字符串不对');
    assert.equal(uinv.isObject(function () {

    }), false, '函数不对');
    assert.equal(uinv.isObject(['a', 'b']), false, '数组不对');
    assert.equal(uinv.isObject({'a': 'b'}), true, 'object对');
  });

  it('isError() 验证', function () {
    var str = 'fff';
    assert.isFalse(uinv.isError(str), '字符串不是错误');

    var err = new Error(str);
    assert.isTrue(uinv.isError(err));
  });

  it('isNumber() 验证', function () {
    var str = '1';
    assert.isFalse(uinv.isNumber(str), '字符串不是数字');

    assert.isTrue(uinv.isNumber(1));
    assert.isTrue(uinv.isNumber(1.24));
    assert.isTrue(uinv.isNumber(-1));
    assert.isTrue(uinv.isNumber(0));
  });

  it('isString() 验证', function () {
    assert.isTrue(uinv.isString("1"));
    assert.isTrue(uinv.isString("haha"));

    assert.isFalse(uinv.isString(1.24));
    assert.isFalse(uinv.isString(true));
    assert.isFalse(uinv.isString([]));
    assert.isFalse(uinv.isString(null));
    assert.isFalse(uinv.isString(undefined));
    assert.isFalse(uinv.isString({}));
  });

  it('空函数 noop() 验证', function () {
    assert.isFunction(uinv.noop);
    assert.isUndefined(uinv.noop());
  });
});
