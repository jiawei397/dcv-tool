import {assert, expect} from 'chai';
import hash from '../../../src/common/hash';
import utils from '../../../src/common/utils';

describe('hash', () => {
  // let jsonObj = {"name": "god", "sex": "men", "love": "you", "life": undefined};
  it('hash.getSize(object)，验证获取对象中元素的数目', function () {
    let jsonObj = {'name': 'god', 'sex': 'men'};
    assert.equal(hash.getSize(jsonObj), 2);
  });
  it('hash.isEmpty(), 验证，查看对象是否包含元素', function () {
    let jsonObj = {name: 'sai'};
    assert.equal(hash.isEmpty({}), true);
    assert.equal(hash.isEmpty(jsonObj), false);
    assert.equal(hash.isEmpty(null), true);
  });
  it('hash.hasKey(), 验证，查看对象中是否包含指定名称的元素', function () {
    let jsonObj = {'love': 'you', 'life': undefined};
    assert.equal(hash.hasKey(jsonObj, 'love'), true);
    assert.equal(hash.hasKey(jsonObj, 'me'), false);
    assert.equal(hash.hasKey(jsonObj, 'life'), true);
    assert.equal(hash.hasKey(null, 'life'), false);
  });
  it('hash.renameKey(opObject, oldKey, newKey)，验证：重新命名对象元素', function () {
    let jsonObj: any = {name: 'god', sex: 'men'};
    hash.renameKey(jsonObj, 'name', 'heart');
    assert.equal(jsonObj.heart, 'god');
  });
  it('hash.getFirstKey(opObject), 验证：获取第一个元素的名称', function () {
    let jsonObj = {name: 'god', sex: 'men'};
    assert.equal(hash.getFirstKey(jsonObj), 'name');
    assert.isNull(hash.getFirstKey(), '不传参数，结果为null');
    assert.isNull(hash.getFirstKey(null), '参数为null时，结果为null');
  });
  it('hash.keys(opObject), 验证：获取所有对象的名称', function () {
    let jsonObj = {name: 'god', sex: 'men'};
    let getObj = hash.keys(jsonObj);
    assert.equal(getObj[0], 'name');
    assert.equal(getObj[1], 'sex');
    assert.equal(null, null);
  });
  it('hash.getFirstValue(opObject), 验证：获取对象中第一个元素的值', function () {
    let jsonObj = {name: 'god', sex: 'men'};
    // let getObj = hash.getFirstValue(jsonObj);
    assert.equal(hash.getFirstValue(jsonObj), 'god');
    assert.equal(hash.getFirstValue(null), undefined);
  });
  it('hash.values(opObject), 验证：获取对象中所有元素的值', function () {
    let jsonObj = {name: 'god', sex: 'men'};
    let keys = hash.values(jsonObj);
    let key = hash.values(null);
    let arr = hash.values([1, 2, '1324']);
    assert.sameMembers(keys, ['god', 'men']);
    assert.sameMembers(key, []);
    assert.sameMembers(arr, [1, 2, '1324']);
  });
  it('hash.clear(opObject), 验证：清除对象中的元素', function () {
    let jsonObj = {name: 'god', sex: 'men'};
    hash.clear(jsonObj);
    // console.log(jsonObj);
    // assert.isEmpty(jsonObj);
    assert.equal(hash.isEmpty(jsonObj), true);
  });
  it('hash.deepEqual 验证：判断2个对象是否相等', function () {
    let obj1;
    let obj2;
    assert.isFalse(hash.deepEqual(obj1, obj2));

    obj1 = null;
    obj2 = null;
    assert.isFalse(hash.deepEqual(obj1, obj2));

    obj1 = {name: 'god', sex: 'men'};
    assert.isFalse(hash.deepEqual(obj1, obj2));

    obj2 = {name: 'god', sex: 'men'};
    assert.isTrue(hash.deepEqual(obj1, obj2));
  });

  it('hash.combineNew(opObjectA, opObjectB, isDeep, isReturnNew, isCloneObjDeep), 验证：合并对象 只会在A的基础上添加元素,不影响原有元素 返回长大了的A', function () {
    let opObjectA = {name: 'god', sex: 'men'};
    let opObjectB = {name: 'tian', factory: 'KONGFU'};
    opObjectA = hash.combineNew(opObjectA, opObjectB);
    // console.log(opObjectA);
    expect(opObjectA).to.deep.equal({name: 'god', sex: 'men', factory: 'KONGFU'});
  });
  it('hash.subtract(opObjectA, opObjectB, isReturnNew), 验证：消减对象 消减A与B中相同的元素 返回被消减的A', function () {
    let opObjectA = {name: 'god', sex: 'men'};
    let opObjectB = {name: 'god', factory: 'KONGFU'};
    opObjectA = hash.subtract(opObjectA, opObjectB);
    opObjectB = hash.subtract(opObjectB, {});
    // console.log(opObjectA);
    // console.log(opObjectB);
    expect(opObjectA).to.deep.equal({sex: 'men'});
    expect(opObjectB).to.deep.equal({name: 'god', factory: 'KONGFU'});
  });
  it('hash.getIntersection(opObjectA, opObjectB, isReturnNew), 验证：获取交叉值 以A为标准,返回A中与B相同元素组成的对象', function () {
    let opObjectA = {name: 'god', sex: 'men'};
    let opObjectB = {name: 'god', factory: 'KONGFU'};
    opObjectA = hash.getIntersection(opObjectA, opObjectB);
    opObjectB = hash.getIntersection(opObjectB, {});
    expect(opObjectA).to.deep.equal({name: 'god'});
    expect(opObjectB).to.deep.equal({});
  });
});

describe('hash.combine 合并对象 A中与B相同名称的元素会被替换成B中的值 返回长大了的A', () => {
  it('只传递前2个参数', function () {
    let opObjectA = {name: 'god', sex: 'men'};
    let opObjectB = {name: 'tian', factory: 'KONGFU'};
    let result = hash.combine(opObjectA, opObjectB);
    let cloneB = utils.cloneObj(opObjectB);
    assert.equal(result, opObjectA, '合并对象 A中与B相同名称的元素会被替换成B中的值 返回长大了的A');
    assert.deepEqual(cloneB, opObjectB, '对象B没有变化');

    let opObjectC = hash.combine(opObjectB, {});
    expect(opObjectA).to.deep.equal({name: 'tian', sex: 'men', factory: 'KONGFU'});
    expect(opObjectC).to.deep.equal({name: 'tian', factory: 'KONGFU'});
  });

  // it('传递第3个参数，是否深度遍历', function () {
  //   let opObjectA = {name: 'god', sex: 'men'};
  //   let opObjectB = {name: 'tian', factory: 'KONGFU', colors:{a:'b'}};
  //   let result = hash.combine(opObjectA, opObjectB, true);
  //   // let cloneB = utils.cloneObj(opObjectB);
  //
  //
  //   // assert.notEqual(result, opObjectA, '第4个参数为true时，并没有改变A本身');
  //   // assert.deepEqual(cloneB, opObjectB, '对象B没有变化');
  //   //
  //   let result2 = hash.combine(opObjectA, opObjectB, false);
  //   assert.equal(result2, opObjectA);
  //   // assert.equal(result2, opObjectA, '第4个参数为false时，改变A本身');
  // });

  it('传递第4个参数，是否复制原对象', function () {
    let opObjectA = {name: 'god', sex: 'men'};
    let opObjectB = {name: 'tian', factory: 'KONGFU'};
    let result = hash.combine(opObjectA, opObjectB, true, true);
    let cloneB = utils.cloneObj(opObjectB);
    assert.notEqual(result, opObjectA, '第4个参数为true时，并没有改变A本身');
    assert.deepEqual(cloneB, opObjectB, '对象B没有变化');

    let result2 = hash.combine(opObjectA, opObjectB, true, false);
    assert.equal(result2, opObjectA, '第4个参数为false时，改变A本身');
  });
});
