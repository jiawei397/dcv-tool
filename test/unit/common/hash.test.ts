import { assert, expect} from 'chai';
import hash from '../../../src/common/hash';

describe('hash', () => {
  // var jsonObj = {"name": "god", "sex": "men", "love": "you", "life": undefined};
  it('hash.getSize(object)，验证获取对象中元素的数目', function () {
    var jsonObj = {'name': 'god', 'sex': 'men'};
    assert.equal(hash.getSize(jsonObj), 2);
  });
  it('hash.isEmpty(), 验证，查看对象是否包含元素', function () {
    var jsonObj = {name: 'sai'};
    assert.equal(hash.isEmpty({}), true);
    assert.equal(hash.isEmpty(jsonObj), false);
    assert.equal(hash.isEmpty(null), true);
  });
  it('hash.hasKey(), 验证，查看对象中是否包含指定名称的元素', function () {
    var jsonObj = {'love': 'you', 'life': undefined};
    assert.equal(hash.hasKey(jsonObj, 'love'), true);
    assert.equal(hash.hasKey(jsonObj, 'me'), false);
    assert.equal(hash.hasKey(jsonObj, 'life'), true);
    assert.equal(hash.hasKey(null, 'life'), false);
  });
  it('hash.renameKey(opObject, oldKey, newKey)，验证：重新命名对象元素', function () {
    var jsonObj = {name: 'god', sex: 'men'};
    hash.renameKey(jsonObj, 'name', 'heart');
    assert.include(jsonObj, {'heart': 'god'});
  });
  it('hash.getFirstKey(opObject), 验证：获取第一个元素的名称', function () {
    var jsonObj = {name: 'god', sex: 'men'};
    assert.equal(hash.getFirstKey(jsonObj), 'name');
    assert.isNull(hash.getFirstKey(), '不传参数，结果为null');
    assert.isNull(hash.getFirstKey(null), '参数为null时，结果为null');
  });
  it('hash.keys(opObject), 验证：获取所有对象的名称', function () {
    var jsonObj = {name: 'god', sex: 'men'};
    var getObj = hash.keys(jsonObj);
    assert.equal(getObj[0], 'name');
    assert.equal(getObj[1], 'sex');
    assert.equal(null, null);
  });
  it('hash.getFirstValue(opObject), 验证：获取对象中第一个元素的值', function () {
    var jsonObj = {name: 'god', sex: 'men'};
    // var getObj = hash.getFirstValue(jsonObj);
    assert.equal(hash.getFirstValue(jsonObj), 'god');
    assert.equal(hash.getFirstValue(null), undefined);
  });
  it('hash.values(opObject), 验证：获取对象中所有元素的值', function () {
    var jsonObj = {name: 'god', sex: 'men'};
    var keys = hash.values(jsonObj);
    var key = hash.values(null);
    var arr = hash.values([1, 2, '1324']);
    assert.sameMembers(keys, ['god', 'men']);
    assert.sameMembers(key, []);
    assert.sameMembers(arr, [1, 2, '1324']);
  });
  it('hash.clear(opObject), 验证：清除对象中的元素', function () {
    var jsonObj = {name: 'god', sex: 'men'};
    hash.clear(jsonObj);
    // console.log(jsonObj);
    // assert.isEmpty(jsonObj);
    assert.equal(hash.isEmpty(jsonObj), true);
  });
  it('hash.deepEqual 验证：判断2个对象是否相等', function () {
    var obj1;
    var obj2;
    assert.isFalse(hash.deepEqual(obj1, obj2));

    obj1 = null;
    obj2 = null;
    assert.isFalse(hash.deepEqual(obj1, obj2));

    obj1 = {name: 'god', sex: 'men'};
    assert.isFalse(hash.deepEqual(obj1, obj2));

    obj2 = {name: 'god', sex: 'men'};
    assert.isTrue(hash.deepEqual(obj1, obj2));
  });
  it('hash.combine(opObjectA, opObjectB, isDeep, isReturnNew, isCloneObjDeep), 验证：合并对象 A中与B相同名称的元素会被替换成B中的值 返回长大了的A', function () {
    var opObjectA = {name: 'god', sex: 'men'};
    var opObjectB = {name: 'tian', factory: 'KONGFU'};
    opObjectA = hash.combine(opObjectA, opObjectB);
    var opObjectC = hash.combine(opObjectB, {});
    // console.log(opObjectA);
    // console.log(opObjectC);
    expect(opObjectA).to.deep.equal({name: 'tian', sex: 'men', factory: 'KONGFU'});
    expect(opObjectC).to.deep.equal({name: 'tian', factory: 'KONGFU'});
  });
  it('hash.combineNew(opObjectA, opObjectB, isDeep, isReturnNew, isCloneObjDeep), 验证：合并对象 只会在A的基础上添加元素,不影响原有元素 返回长大了的A', function () {
    var opObjectA = {name: 'god', sex: 'men'};
    var opObjectB = {name: 'tian', factory: 'KONGFU'};
    opObjectA = hash.combineNew(opObjectA, opObjectB);
    // console.log(opObjectA);
    expect(opObjectA).to.deep.equal({name: 'god', sex: 'men', factory: 'KONGFU'});
  });
  it('hash.subtract(opObjectA, opObjectB, isReturnNew), 验证：消减对象 消减A与B中相同的元素 返回被消减的A', function () {
    var opObjectA = {name: 'god', sex: 'men'};
    var opObjectB = {name: 'god', factory: 'KONGFU'};
    opObjectA = hash.subtract(opObjectA, opObjectB);
    opObjectB = hash.subtract(opObjectB, {});
    // console.log(opObjectA);
    // console.log(opObjectB);
    expect(opObjectA).to.deep.equal({sex: 'men'});
    expect(opObjectB).to.deep.equal({name: 'god', factory: 'KONGFU'});
  });
  it('hash.getIntersection(opObjectA, opObjectB, isReturnNew), 验证：获取交叉值 以A为标准,返回A中与B相同元素组成的对象', function () {
    var opObjectA = {name: 'god', sex: 'men'};
    var opObjectB = {name: 'god', factory: 'KONGFU'};
    opObjectA = hash.getIntersection(opObjectA, opObjectB);
    opObjectB = hash.getIntersection(opObjectB, {});
    expect(opObjectA).to.deep.equal({name: 'god'});
    expect(opObjectB).to.deep.equal({});
  });
});
