const image: any = {};

/**
 * 转换字符串为base64位格式
 */
image.convertStrToBase64 = function (dataUrl: string) {
  const err = new Error('format error!');
  if (!dataUrl || typeof dataUrl !== 'string') {
    throw err;
  }
  let arr = dataUrl.split(';');
  let arr2 = arr[0].split(':');
  if (arr2.length === 1) {
    throw err;
  }
  return {
    type: arr2[1],
    dataURL: dataUrl
  };
};

/**
 * dataURL(base64字符串)转换为Blob对象（二进制大对象）
 * @param {String} dataUrl base64字符串
 * @return {Blob}
 */
image.convertBase64StrToBlob = function (dataUrl: string) {
  return image.convertBase64UrlToBlob(this.convertStrToBase64(dataUrl));
};

/**
 * 将以base64的图片url数据转换为Blob
 * @param base64 用url方式表示的base64图片数据
 */
image.convertBase64UrlToBlob = function (base64) {
  let urlData = base64.dataURL;
  let type = base64.type;
  let bytes = atob(urlData.split(',')[1]); //去掉url的头，并转换为byte
  //处理异常,将ascii码小于0的转换为大于0
  let ab = new ArrayBuffer(bytes.length);
  let ia = new Uint8Array(ab);
  for (let i = 0; i < bytes.length; i++) {
    ia[i] = bytes.charCodeAt(i);
  }
  return new Blob([ab], {type: type});
};

/*
 * 图片转换成base64编码
 * @param {Image} img 图片
 */
image.getBase64ByImage = function (img) {
  let canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  let ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, img.width, img.height);
  let ext = img.src.substring(img.src.lastIndexOf('.') + 1).toLowerCase();
  let dataURL = canvas.toDataURL('image/' + ext);
  return {
    dataURL: dataURL,
    type: 'image/' + ext
  };
};

export default image;
