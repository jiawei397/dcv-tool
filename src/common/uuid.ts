import utils from './utils';

/**
 * UUID整数节点
 * @param {String} val  源
 * @param {Number} start 起点
 * @param {Number} end   终点
 * @return {String}    截取后的字符串
 */
const getIntegerBits = function (val: number, start: number, end: number) {
  let base16 = getBase(val, 16);
  let quadArray = [];
  let quadString = '';
  let i = 0;
  for (i = 0; i < base16.length; i++) {
    quadArray.push(base16.substring(i, i + 1));
  }
  for (i = Math.floor(start / 4); i <= Math.floor(end / 4); i++) {
    if (!quadArray[i] || quadArray[i] == '') quadString += '0';
    else quadString += quadArray[i];
  }
  return quadString;
};
/**
 * 把十进制数字转成16进制的数字
 * @param {Number} num 十进制数字
 * @param {} base
 * @return {String}
 */
const getBase = function (num: number, base) {
  return num.toString(base).toUpperCase();
};
/**
 * 返回随机近似整数值
 * @param {Number} max
 * @return {Number}
 */
const getRand = function (max: number) {
  return Math.floor(utils.random() * (max + 1));
};

/**
 * 创建唯一识别码 (Universally Unique Identifier)
 * @return {String}
 */
const createUUID = function () {
  let dg = new Date(1582, 10, 15, 0, 0, 0, 0);
  let dc = new Date();
  let t = dc.getTime() - dg.getTime();
  let tl = getIntegerBits(t, 0, 31);
  let tm = getIntegerBits(t, 32, 47);
  let thv = getIntegerBits(t, 48, 59) + '1'; // version 1, security version is 2
  let csar = getIntegerBits(getRand(4095), 0, 7);
  let csl = getIntegerBits(getRand(4095), 0, 7);

  let n = getIntegerBits(getRand(8191), 0, 7)
    + getIntegerBits(getRand(8191), 8, 15)
    + getIntegerBits(getRand(8191), 0, 7)
    + getIntegerBits(getRand(8191), 8, 15)
    + getIntegerBits(getRand(8191), 0, 15); // this last number is two octets long
  return tl + tm + thv + csar + csl + n;
};

export default createUUID;
