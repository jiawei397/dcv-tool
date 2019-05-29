/**
 * 延时某段时间，只执行最后一次
 * 类似于requestAnimationFrame
 */
let delayMap = {};

export interface IDelayOpts {
  id: string | number;
  context: object;
  args: any;
  time: number;
}

function clear(id: string | number) {
  //第二个参数为id
  let delayID = delayMap[id];
  if (delayID) {
    clearTimeout(delayID);
    delete delayMap[id];
  }
}

const delay = function (fn: (param: any) => void, {
  id = 'throttle_id', //增加一个id，用来获取setTimeout的id
  context = null, //作用域
  args = [], //相关参数
  time = 300//延迟执行的时间
}: Partial<IDelayOpts> = {}) {
  //获取第一个参数
  let delayID;
  // console.error(id);
  clear(id); //清除计时器
  delayID = setTimeout(function () {
    //执行函数
    fn.apply(context, args);
  }, time);
  delayMap[id] = delayID;
  return delayID;
};

export default delay;
