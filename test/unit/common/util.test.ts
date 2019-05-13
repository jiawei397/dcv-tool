import {assert, expect} from 'chai';
import util from '../../../src/common/util';
import '../../../src/common/polyfill';

describe('util函数 验证', function () {

  const obj = {
    'num': 1,
    'string': '日新月异',
    'boolean': true,
    'obj': {},
    'fun': function () {
    },
    'date': new Date(),
    'undefined': undefined,
    'null': null,
    'array': [1, 2, 1, 2, 1, 34, 5, 6, 2]
  };

  it('util.ramdom() 验证', function () {
    for (let i = 0; i < 100; i++) {
      let num = util.ramdom(0, 10);
      assert.isTrue(num >= 0);
      assert.isTrue(num <= 10);
    }

    for (let i = 0; i < 100; i++) {
      let num = util.ramdom(10, 0);
      assert.isTrue(num >= 0);
      assert.isTrue(num <= 10);
    }
  });

  it('数组辅助方法 unique() 验证', function () {
    let noRepeatArr = util.unique(obj.array, false);
    assert.lengthOf(noRepeatArr, 5, '不留下第一个相同的元素');
  });

  it('数组辅助方法 clearArray() 验证', function () {
    let arr = util.clearArray([1, 2, 3, 2, 4, 2]);
    assert.lengthOf(arr, 0);
  });

  it('数组辅助方法 findItemInArray() 验证', function () {
    let arr = [100, 20, 30, 40, 50],
      num = Math.ceil(Math.random() * 4),
      index = util.findItemInArray(arr, arr[num]),
      indexNot = util.findItemInArray(arr, 'hello');
    assert.equal(index, num);
    assert.equal(indexNot, -1);
  });

  it('数组辅助方法 isInArray() 验证', function () {
    let arr = [1, 2, 3, 4, 5];
    assert.equal(util.isInArray(3, arr), true);
    assert.equal(util.isInArray(123, arr), false);
  });

  it('数组辅助方法 clearEmptyItemInArray() 验证', function () {
    let arr = [1, 2, undefined, 3, '', 4, 5];
    let newArr = util.clearEmptyItemInArray(arr);
    assert.equal(util.isInArray('', newArr), false);
    assert.equal(util.isInArray(undefined, newArr), false);
  });

  it('数组辅助方法 addNewItemToArray() 验证', function () {
    let arr = [1, 2, 5];
    assert.equal(util.addNewItemToArray(5, arr), 2);
    assert.equal(util.addNewItemToArray(3, arr), 4);
  });

  it('数组辅助方法 insertItemToArray() 验证', function () {
    let arr = [1, 2, 5];
    let newArr = util.insertItemToArray(4, arr, 2);
    assert.equal(newArr[2], 4);
  });

  it('数组辅助方法 getConcomitanceBetweenArrays() 验证', function () {
    let arr1 = [3, 2, 5];
    let arr2 = [4, 2, 3];
    let newArr = util.getConcomitanceBetweenArrays(arr1, arr2);
    assert.deepEqual(newArr, [3, 2]);
  });

  it('数组辅助方法 mergeArrays() 验证', function () {
    let arr1 = [3, 2, 5];
    let arr2 = [4, 2, 3];
    let newArr1 = util.mergeArrays(arr1, arr2, true);
    util.mergeArrays(arr1, arr2, false);
    assert.deepEqual(newArr1, [3, 2, 5, 4, 2, 3]);
    assert.deepEqual(arr1, [3, 2, 5, 4, 2, 3]);
  });

  it('数组辅助方法 concatArrays() 验证', function () {
    let arr1 = [3, 2, 5];
    let arr2 = [4, 2, 3];
    let newArr1 = util.concatArrays(arr1, arr2);
    assert.deepEqual(newArr1, [3, 2, 5, 4]);
    assert.deepEqual(arr1, [3, 2, 5, 4]);
    assert.deepEqual(arr2, [4, 2, 3]);
  });

  it('数组辅助方法 subtractArrays() 验证', function () {
    let arr1 = [3, 2, 5];
    let arr2 = [4, 2, 3];
    let newArr1 = util.subtractArrays(arr1, arr2);
    assert.deepEqual(newArr1, [5]);
    assert.deepEqual(arr1, [3, 2, 5]);
    assert.deepEqual(arr2, [4, 2, 3]);
  });

  it('数组辅助方法 delItemsByIndexArray() 验证', function () {
    let arr1 = [0, 1, 2, 3, 4, 5, 6];
    let arr2 = [1, 5, 3];
    util.delItemsByIndexArray(arr1, arr2);
    assert.deepEqual(arr1, [0, 2, 4, 6]);
    assert.deepEqual(arr2, [5, 3, 1]);
  });

  it('数组辅助方法 delFirstItemFromArray() 验证', function () {
    let arr1 = [0, 6, 2, 6, 4, 5, 6];
    util.delFirstItemFromArray(arr1, 6);
    assert.deepEqual(arr1, [0, 2, 6, 4, 5, 6]);
  });

  /*  it("数组辅助方法 getItemsFromArrayByKey() 验证", function () {
      let arr1 = [{"hello": "kitty"}, {"hello": "tom"}, {"你好": "大叔"}];
      let newArr = util.getItemsFromArrayByKey(arr1, "hello");
      assert.deepEqual(arr1, [{"hello": "kitty"}, {"hello": "tom"}, {"你好": "大叔"}]);
      assert.deepEqual(newArr, ["kitty", "tom"]);
    });*/

  it('数组辅助方法 getAttrsFromObjectByKeys() 验证', function () {
    let arr1 = {'001': {'hello': 'kitty'}, '002': {'hello': 'tom'}, '003': {'你好': '大叔'}};
    let newArr1 = util.getAttrsFromObjectByKeys(arr1, '003');
    let newArr2 = util.getAttrsFromObjectByKeys(arr1, ['001', '003']);
    assert.deepEqual(newArr1, {'你好': '大叔'});
    assert.deepEqual(newArr2, [{'001': {'hello': 'kitty'}, '003': {'你好': '大叔'}}]);
  });

  it('数组辅助方法 sortArrayByChar() 验证', function () {
    let arr1 = [{'name': 'nico', 'age': 12}, {'name': 'leo', 'age': 14}, {'name': 'may', 'age': 10}];
    let newArr1 = util.sortArrayByChar(arr1, {'useAttribute': 'name'});
    assert.deepEqual(newArr1, [{'name': 'leo', 'age': 14}, {'name': 'may', 'age': 10}, {'name': 'nico', 'age': 12}]);
  });

  it('数组辅助方法 sortArrayByNumber() 验证', function () {
    let arr1 = [{'name': 'nico', 'age': 12}, {'name': 'leo', 'age': 14}, {'name': 'may', 'age': 10}];
    let newArr2 = util.sortArrayByNumber(arr1, {'useAttribute': 'age', 'dir': 'descending'});
    assert.deepEqual(newArr2, [{'name': 'leo', 'age': 14}, {'name': 'nico', 'age': 12}, {'name': 'may', 'age': 10}]);
    let newArr1 = util.sortArrayByNumber(arr1, {'useAttribute': 'age'});
    assert.deepEqual(newArr1, [{'name': 'may', 'age': 10}, {'name': 'nico', 'age': 12}, {'name': 'leo', 'age': 14}]);
  });

  it('数组辅助方法 isNum() 验证', function () {
    assert.equal(util.isNum(1), true);
    assert.equal(util.isNum(1.2), false);
    assert.equal(util.isNum('hh'), false);
  });

  it('Number 四舍五入为指定小数位数的数字 toFixed() 验证, 这个依赖于我们修改过的Number.toFixed方法', function () {
    assert.equal(util.toFixed(1.34, 1), 1.3);
    assert.equal(util.toFixed(1.34, 5, true), 1.34000);
    assert.equal(util.toFixed(1.345, 2), 1.35);
    assert.equal(util.toFixed(1.34999999999, 1), 1.3);
  });

  it('把RGB值转为系统使用的格式 normalizeColor() 验证', function () {
    assert.deepEqual(util.normalizeColor('12 45 255'), ['0.047', '0.176', '1.000', 1]);
    assert.deepEqual(util.normalizeColor('12,45,255,100'), ['0.047', '0.176', '1.000', '0.392']);
    assert.deepEqual(util.normalizeColor('0.12 0.45 0.255'), ['0.12', '0.45', '0.255', 1]);
    assert.deepEqual(util.normalizeColor('0.12,0.45,0.255,0.8'), ['0.12', '0.45', '0.255', '0.8']);
  });

  it('解析网页颜色 parseWebColor() 验证', function () {
    assert.equal(util.parseWebColor('12 45 255'), '#0c2dff');
    assert.equal(util.parseWebColor('12,45,255'), '#0c2dff');
    assert.equal(util.parseWebColor('0.12 0.45 0.255'), '#1f7341');
    assert.equal(util.parseWebColor('0.12,0.45,0.255'), '#1f7341');
  });

  it('解析16进制网页颜色转换为RGB值 toHexString() 验证', function () {
    assert.deepEqual(util.toHexString('#d0e3a2'), [0.8156862745098039, 0.8901960784313725, 0.6352941176470588]);
  });

  it('base64加密 base64Encode() 验证', function () {
    assert.equal(util.base64Encode('uinnova'), 'dWlubm92YQ==');
  });

  it('过滤特殊字符串并清除空格 delSpaceCharacter() 验证', function () {
    assert.equal(util.delSpaceCharacter('null#$^ &*|{}<>@#￥……&*|‘”“'), 'null');
  });

  it('过滤特殊字符 replaceMark() 验证', function () {
    assert.equal(util.replaceMark('null~^*=|{}<>￥……*|‘”“\''), 'null');
  });

  it('测试是否包含特殊字符 testMark() 验证', function () {
    assert.equal(util.testMark('~^*|{}<>￥……*|‘”“'), true);
  });

  it('删除所有空格和单引号 delSpace() 验证', function () {
    let str = '刚刚加上 ';
    let str1 = ' " ';
    let str2 = '""';
    assert.equal(util.delSpace(str + str1 + str2), '刚刚加上');
  });

  it('判断字符串的开始字符 stringStartWith() 验证', function () {
    assert.equal(util.stringStartWith('hello', 'hel'), true);
    assert.equal(util.stringStartWith('19195', '91'), false);
  });

  it('判断字符串的结束字符 stringEndWith() 验证', function () {
    assert.equal(util.stringEndWith('hello', 'llo'), true);
    assert.equal(util.stringEndWith('19195', '96'), false);
  });

  it('平铺数组 flatten() 验证', function () {
    let arr = [1, 2, [3, 4], [[[5]]]];
    let result = util.flatten(arr);
    assert.notEqual(arr, result);
    assert.deepEqual(result, [1, 2, 3, 4, 5]);
    assert.equal(result.length, 5);
  });
});
