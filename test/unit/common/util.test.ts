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
    assert.deepEqual(result, ['a22', 'aB3', 'eF2', 'ea1', 'e11', 'eA1']);
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

    assert.deepEqual(util.toHexString([1, 2, 3]), [0, 0, 0]);
    assert.deepEqual(util.toHexString(12), [0, 0, 0]);
    assert.deepEqual(util.toHexString(null), [0, 0, 0]);
    assert.deepEqual(util.toHexString({a: 'b'}), [0, 0, 0]);
    assert.deepEqual(util.toHexString(undefined), [0, 0, 0]);
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

  it('dataURLtoBlob  验证', function () {
    const base64 = 'data:image/png;base64,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';
    assert.instanceOf(util.dataURLtoBlob(base64), Blob);
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
