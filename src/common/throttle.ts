/**
 * 节流器
 * @author jw
 * @date 2017-11-29
 */
let map = {};

function clear(isClear: boolean, id: string | number) {
  //第二个参数为id
  let _throttleID = map[id];
  if (_throttleID) {
    clearTimeout(_throttleID);
    delete map[id];
  }
}

interface Opts {
  id: string | number,
  context: object,
  args: any [],
  time: number
}

function throttle(fn: Function, {
  id = 'throttle_id', //增加一个id，用来获取setTimeout的id
  context = null, //作用域
  args = [], //相关参数
  time = 300//延迟执行的时间
}: Partial<Opts> = {}) {
  //获取第一个参数
  let _throttleID;
  // console.error(id);
  clear(true, id);//清除计时器
  _throttleID = setTimeout(function () {
    //执行函数
    fn.apply(context, args);
  }, time);
  map[id] = _throttleID;
  return _throttleID;
}

export default throttle;
