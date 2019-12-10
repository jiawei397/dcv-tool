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
    assert.equal(noRepeatArr, obj.array, '操作的是原数组');

    let arr = [1, 2, 1];
    util.unique(arr);
    assert.deepEqual(arr, [2, 1], '不传第2个参数，会删除第1个重复项');

    arr = [1, 2, 1];
    util.unique(arr, false);
    assert.deepEqual(arr, [2, 1], '默认效果与false一样');

    arr = [1, 2, 1];
    util.unique(arr, true);
    assert.deepEqual(arr, [1, 2], '第2个参数为true时，会保留第1个重复项');
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

  it('getAttrsFromObjectByKeys() 验证', function () {
    let map = {'001': {'hello': 'kitty'}, '002': {'hello': 'tom'}, '003': {'你好': '大叔'}};
    let newArr1 = util.getAttrsFromObjectByKeys(map, '003');
    let newArr2 = util.getAttrsFromObjectByKeys(map, ['001', '003']);
    assert.deepEqual(newArr1, {'你好': '大叔'});
    assert.deepEqual(newArr2, [{'001': {'hello': 'kitty'}, '003': {'你好': '大叔'}}]);
  });

  it('数组辅助方法 sortArrayByChar() 验证', function () {
    let arr1 = [{'name': 'nico', 'age': 12}, {'name': 'leo', 'age': 14}, {'name': 'may', 'age': 10}];
    let newArr1 = util.sortArrayByChar(arr1, {'useAttribute': 'name'});
    assert.deepEqual(newArr1, [{'name': 'leo', 'age': 14}, {'name': 'may', 'age': 10}, {'name': 'nico', 'age': 12}]);

    let arr2 = ['e11', 'eF2', 'eA1', 'ea1', 'a22', 'aB3'];
    let result = util.sortArrayByChar(arr2);
    assert.deepEqual(result, ['a22', 'aB3', 'ea1', 'e11', 'eA1', 'eF2']);
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
    // assert.deepEqual(util.toHexString('#d0e3a2'), [0.8156862745098039, 0.8901960784313725, 0.6352941176470588]);
    assert.deepEqual(util.toHexString([1, 2, 3]), [0, 0, 0]);
    assert.deepEqual(util.toHexString(12), [0, 0, 0]);
    assert.deepEqual(util.toHexString(null), [0, 0, 0]);
    assert.deepEqual(util.toHexString({a: 'b'}), [0, 0, 0]);
    assert.deepEqual(util.toHexString(undefined), [0, 0, 0]);
  });

  it('将rgb转换为16进制值 colorRGBtoHex() 验证', function () {
    assert.deepEqual(util.colorRGBtoHex('rgb(0,0,0)'), '#000000');
    assert.deepEqual(util.colorRGBtoHex('rgb(255,255,0)'), '#ffff00');
    assert.deepEqual(util.colorRGBtoHex('rgb(255,33,244)'), '#ff21f4');
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

  it('合并数组 concatArr() 验证', function () {
    let arr = [1, 2];
    let arr2 = [3, 4];
    let result = util.concatArr(arr, arr2);
    assert.equal(arr.length, 4);
    assert.deepEqual(arr, [1, 2, 3, 4]);
    assert.equal(result, arr);
  });

  it('数组升序降序 验证', function () {
    let arr = [2, 1, 4, 3];
    arr.sort(util._ArraySort_Up);
    assert.equal(arr[0], 1);

    arr.sort(util._ArraySort_Down);
    assert.equal(arr[0], 4);
  });

  it('getItemsFromArrayByKey 验证', function () {
    let arr = [{
      'a': 1,
      'b': 2
    }, {
      'a': 3,
      'b': 4
    }];
    let result = util.getItemsFromArrayByKey(arr, 'a');
    assert.deepEqual(result, [1, 3]);

    let result2 = util.getItemsFromArrayByKey(arr, 'b');
    assert.deepEqual(result2, [2, 4]);

    let map = {
      'a': 1,
      'b': 2
    };
    let result3 = util.getItemsFromArrayByKey(map, 'a');
    assert.deepEqual(result3, [1]);
  });

  it('getItemsFromArrayByKeys 验证', function () {
    let arr = [{
      'a': 1,
      'b': 2,
      'c': 1
    }, {
      'a': 3,
      'b': 4
    }];
    let result = util.getItemsFromArrayByKeys(arr, 'a');
    assert.deepEqual(result, [{
      'a': 1
    }, {
      'a': 3
    }]);

    let result2 = util.getItemsFromArrayByKeys(arr, 'b');
    assert.deepEqual(result2, [{
      'b': 2
    }, {
      'b': 4
    }]);

    let result3 = util.getItemsFromArrayByKeys(arr, ['b', 'c']);
    assert.deepEqual(result3, [{
      'b': 2,
      'c': 1
    }, {
      'b': 4
    }]);

    let map = {
      'a': 1,
      'b': 2
    };
    let result4 = util.getItemsFromArrayByKeys(map, 'a');
    assert.deepEqual(result4, [{
      'a': 1
    }]);

    let result5 = util.getItemsFromArrayByKeys(map, ['a', 'c']);
    assert.deepEqual(result5, [{
      'a': 1
    }]);

    let arr2 = [{
      'a': 1,
      'b': 2,
      'c': 0,
      'd': false,
      'e': null
    }, {
      'a': 3,
      'b': 4,
      'e': undefined
    }];
    let result6 = util.getItemsFromArrayByKeys(arr2, ['a', 'c', 'd']);
    assert.deepEqual(result6, [{
      'a': 1
    }, {
      'a': 3
    }]);

    let result7 = util.getItemsFromArrayByKeys(arr2, ['a', 'c', 'd', 'e'], true);
    assert.deepEqual(result7, [{
      'a': 1,
      'c': 0,
      'd': false,
      'e': null
    }, {
      'a': 3
    }], '测试可以为空的情况');
  });
});

describe('路径解析 验证', function () {
  const obj = {
    'productInfo': {
      'Tag': 'abc'
    }
  };
  it('_parsePathForAttribute 验证', function () {
    let path = 'productInfo/Tag';
    let result = util._parsePathForAttribute(path);
    assert.equal(result.length, 2);
    assert.equal(result[0], 'productInfo');
    assert.equal(result[1], 'Tag');

    let path2 = {};
    let result2 = util._parsePathForAttribute(path2);
    assert.isObject(result2);
    assert.equal(result2, path2, '不是字符串，就直接返回了');
  });

  it('getAttribute  验证', function () {
    let val = util.getAttribute(obj, 'productInfo/Tag');
    assert.equal(val, 'abc');

    let val2 = util.getAttribute(obj, 'productInfo\\Tag');
    assert.equal(val2, 'abc');

    let val3 = util.getAttribute(obj, 'productInfo\\Tag2');
    assert.isUndefined(val3, '找不到就返回undefined');

    let val4 = util.getAttribute(null, 'productInfo\\Tag2');
    assert.isUndefined(val4, '找不到就返回undefined');
  });

  it('setAttribute  验证', function () {
    util.setAttribute(obj, 'productInfo/Tag2', 'abc');

    let val = util.getAttribute(obj, 'productInfo\\Tag2');
    assert.equal(val, 'abc');
    assert.equal(obj['productInfo']['Tag2'], 'abc');
  });

  it('delAttribute   验证', function () {
    let obj2 = {
      'productInfo': {
        'Tag': 'abc'
      }
    };
    util.delAttribute(obj2, 'productInfo/Tag');

    let val = util.getAttribute(obj2, 'productInfo/Tag');
    assert.isUndefined(val, '已经被删除');

    util.delAttribute(obj2, 'productInfo/Tag2');
    assert.deepEqual(obj2, {'productInfo': {}});
  });

  it('filenameFromPath 验证', function () {
    let path = 'a/b/c';
    let name = util.filenameFromPath(path);
    assert.equal(name, 'c');

    let path2 = 'a\\b\\c';
    let name2 = util.filenameFromPath(path2);
    assert.equal(name2, 'c');

    let path3 = 'abc';
    let filePath3 = util.filenameFromPath(path3);
    assert.equal(filePath3, path3, '如果没找到/或\\，返回原值');
  });

  it('getFilenamePath 验证', function () {
    let path = 'http://192.168.1.121/a/b/c';
    let filePath = util.getFilenamePath(path);
    assert.equal(filePath, 'http://192.168.1.121/a/b/');

    let path2 = 'http://192.168.1.121/a\\b\\c';
    let filePath2 = util.getFilenamePath(path2);
    assert.equal(filePath2, 'http://192.168.1.121/a\\b\\');

    let path3 = 'abc';
    let filePath3 = util.getFilenamePath(path3);
    assert.equal(filePath3, path3, '如果没找到/或\\，返回原值');
  });

  it('getFilenameFile  验证', function () {
    let path = 'http://192.168.1.121/a/b/c.zip';
    let fileName = util.getFilenameFile(path);
    assert.equal(fileName, 'c');

    let path2 = 'http://192.168.1.121/a\\b\\c.abc';
    let fileName2 = util.getFilenameFile(path2);
    assert.equal(fileName2, 'c');

    let path3 = 'a/b/c';
    let fileName3 = util.getFilenameFile(path3);
    assert.equal(fileName3, 'c', '如果没找到小数点，返回/后的值');

    let path4 = 'abc';
    let fileName4 = util.getFilenameFile(path4);
    assert.equal(fileName4, path4, '如果没找到小数点，也没有/或\\，则返回原值');
  });

  it('getFilenameType 验证', function () {
    let path = 'http://192.168.1.121/a/b/c.zip';
    let type = util.getFilenameType(path);
    assert.equal(type, '.zip');

    let path2 = 'http://192.168.1.121/a\\b\\c.abc';
    let type2 = util.getFilenameType(path2);
    assert.equal(type2, '.abc');

    let path3 = 'http://192.168.1.121/a/b.file/c.zip';
    let type3 = util.getFilenameType(path3);
    assert.equal(type3, '.zip', '以结尾为准');

    let path4 = '/a/b/c';
    let type4 = util.getFilenameType(path4);
    assert.equal(type4, '', '如果没找到小数点，返回空字符串');
  });
});
