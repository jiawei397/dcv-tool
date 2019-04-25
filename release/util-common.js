!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?exports.utils=e():t.utils=e()}(this,function(){return function(t){var e={};function r(n){if(e[n])return e[n].exports;var o=e[n]={i:n,l:!1,exports:{}};return t[n].call(o.exports,o,o.exports,r),o.l=!0,o.exports}return r.m=t,r.c=e,r.d=function(t,e,n){r.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},r.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},r.t=function(t,e){if(1&e&&(t=r(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var o in t)r.d(n,o,function(e){return t[e]}.bind(null,o));return n},r.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return r.d(e,"a",e),e},r.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},r.p="",r(r.s=0)}([function(t,e,r){"use strict";r.r(e);r(1);const n={};var o,i;n.isFunction=function(t){return"[object Function]"===Object.prototype.toString.call(t)},n.isObject=function(t){return"[object Object]"===Object.prototype.toString.call(t)},n.isString=function(t){return"[object String]"===Object.prototype.toString.call(t)},n.isNumber=function(t){return"[object Number]"===Object.prototype.toString.call(t)},n.cloneObj=o=function(t,e,r){if(!t||"object"!=typeof t||n.hash.isEmpty(t)||n.isFunction(r)&&r(t))return t;var i=t instanceof Array?[]:{};for(var u in t){var a=t[u];if(e&&"object"==typeof a)if(a instanceof Array){i[u]=[];for(var c=0;c<a.length;c++)"object"!=typeof a[c]?i[u].push(a[c]):i[u].push(o(a[c],e,r))}else i[u]=o(a,e,r);else i[u]=a}return i},n.extend=function(t,e){var r=function(){},o=n.cloneObj;r.prototype=e.prototype,t.prototype=new r,t.prototype.constructor=t,t.superclass=e.prototype,e.prototype.constructor===Object.prototype.constructor&&(e.prototype.constructor=e),t.prototype.__extendList?t.prototype.__extendList=o(t.prototype.__extendList):t.prototype.__extendList=[],t.prototype.__extendList.push(e)},n.multiExtend=function(t,e,r){void 0===r&&(r=!0),n.extend(t,e[0]);for(var o=1;o<e.length;o++){var i=e[o];for(var u in i.prototype)"constructor"!=u&&(r?t.prototype[u]=i.prototype[u]:void 0!==t.prototype[u]&&null!==t.prototype[u]||(t.prototype[u]=i.prototype[u]));t.prototype.__extendList.push(i)}},n.instanceOf=n.isInstance=function(t,e){return t instanceof e||!!(t&&t.__extendList&&t.__extendList.includes(e))},n.noop=function(){},n.eval=function(t){return new Function("return "+t)()},n.jsonParse=function(t,e){if(!t||"string"!=typeof t)return t;var r;try{r=JSON.parse(t,e)}catch(e){try{r=n.eval("("+t+")")}catch(e){r=t}}return r},n.stringify=function(t,e,r){return t&&"object"==typeof t?JSON.stringify(t,e,r):t},n.random=(i=(new Date).getTime(),function(){return(i=(9301*i+49297)%233280)/233280});var u=n;const a={getSize:function(t){var e=0;for(var r in t)e+=1;return e},isEmpty:function(t){for(var e in t)return!1;return!0},hasKey:function(t,e){return null!=t?t.hasOwnProperty(e):(console.error("传入opObject参数有误"),!1)},renameKey:function(t,e,r){if(t[e]){var n=t[e];delete t[e],t[r]=n}},getFirstKey:function(t){for(var e in t)return e;return null},keys:function(t){var e=[];for(var r in t)e.push(r);return e},getFirstValue:function(t){for(var e in t)return t[e]},values:function(t){if(t instanceof Array)return t;var e=[];for(var r in t)e.push(t[r]);return e},clear:function(t){for(var e in t)delete t[e]},combine:function t(e,r,n,o,i){if(o){var a=(u.util.cloneObj||u.cloneObj)(e,i);return t(a,r,n,!1),a}for(var c in r)n?void 0===e[c]||null===e[c]||e[c]instanceof Array||"object"!=typeof e[c]||r[c]instanceof Array||"object"!=typeof r[c]?e[c]=r[c]:t(e[c],r[c],n,!1):e[c]=r[c];return e},combineNew:function t(e,r,n,o,i){if(o){var a=(u.util.cloneObj||u.cloneObj)(e,i);return t(a,r,n,!1),a}for(var c in r)n?void 0===e[c]||null===e[c]||e[c]instanceof Array||"object"!=typeof e[c]||r[c]instanceof Array||"object"!=typeof r[c]?void 0!==e[c]&&null!==e[c]||(e[c]=r[c]):t(e[c],r[c],n,!1):void 0!==e[c]&&null!==e[c]||(e[c]=r[c]);return e},subtract:function(t,e,r){if(void 0===r&&(r=!0),r){var n={};for(var o in t)e&&e[o]||(n[o]=t[o]);return n}for(var i in e)delete t[i];return t},getIntersection:function(t,e,r){var n={};for(var o in t)e[o]&&(r?t[o]==e[o]&&(n[o]=t[o]):n[o]=t[o]);return n}};var c=a;const s={};var f,l;s.throttle=(f={},l=function(){var t,e,r=arguments[0];if("boolean"==typeof r){var n=arguments[1];(e=f[n])&&(clearTimeout(e),delete f[n])}else{t=r;var o=arguments[1],i=c.combine({id:"throttle_id",context:null,args:[],time:300},o);l(!0,i.id),e=setTimeout(function(){t.apply(i.context,i.args)},i.time),f[i.id]=e}}),s._parsePathForAttribute=function(t){return"string"==typeof t?(-1!=t.indexOf("/")?t=t.split("/"):-1!=t.indexOf("\\")&&(t=t.split("\\")),"string"==typeof t?[t]:t):t},s.getAttribute=function(t,e){e=s._parsePathForAttribute(e);for(var r=0;r<e.length;r++){if(!t)return;t=t[e[r]]}return t},s.setAttribute=function(t,e,r){e=s._parsePathForAttribute(e);for(var n=0;n<e.length-1;n++){var o=e[n];t[o]||(t[o]={}),t=t[o]}t[e[e.length-1]]=r},s.delAttribute=function(t,e){e=s._parsePathForAttribute(e);for(var r=0;r<e.length-1;r++){var n=e[r];t[n]||(t[n]={}),t=t[n]}delete t[e[e.length-1]]},s.filenameFromPath=function(t){var e=(t=t.replaceAll("/","\\")).lastIndexOf("\\");return-1==e?t:t.substring(e+1,t.length)},s.getFilenamePath=function(t){var e=t.lastIndexOf("\\");return-1==e&&(e=t.lastIndexOf("/")),-1==e?t:t.substring(0,e+1)},s.getFilenameFile=function(t){var e=s.filenameFromPath(t),r=e.lastIndexOf(".");return-1==r?e:e.substring(0,r)},s.getFilenameType=function(t){var e=t.lastIndexOf(".");return-1==e?"":t.substring(e,t.length)},s.unique=function(t,e){for(var r=[],n=0;n<t.length;n++)for(var o=n+1;o<t.length;o++)t[n]==t[o]&&(e?s.addNewItemToArray(o,r):s.addNewItemToArray(n,r));return s.delItemsByIndexArray(t,r),t},s.clearEmptyItemInArray=function(t){for(var e=0;e<t.length;e++)void 0!==t[e]&&""!=t[e]||(t.splice(e,1),e-=1);return t},s.addNewItemToArray=function(t,e){for(var r=0;r<e.length;r++)if(e[r]==t)return r;return e.push(t),e.length},s.insertItemToArray=function(t,e,r){return e.splice(r,0,t),e},s.getConcomitanceBetweenArrays=function(t,e){for(var r=[],n=0;n<t.length;n++){var o=t[n];-1!=s.findItemInArray(e,o)&&s.addNewItemToArray(o,r)}return r},s.mergeArrays=function(t,e,r){if(r)return t.concat(e);for(var n=0;n<e.length;n++)t.push(e[n]);return t},s.concatArrays=function(t,e){for(var r=0;r<e.length;r++)-1==t.indexOf(e[r])&&t.push(e[r]);return t},s.subtractArrays=function(t,e){for(var r=[],n=0;n<t.length;n++){var o=t[n];-1==s.findItemInArray(e,o)&&s.addNewItemToArray(o,r)}return r},s._ArraySort_Up=function(t,e){return t-e},s._ArraySort_Down=function(t,e){return e-t},s.delItemsByIndexArray=function(t,e){e.sort(s._ArraySort_Down);for(var r=0;r<e.length;r++)t.splice(e[r],1)},s.delFirstItemFromArray=function(t,e){var r=s.findItemInArray(t,e);-1!=r&&t.splice(r,1)},s.getItemsFromArrayByKey=function(t,e){t instanceof Array||(t=[t]);var r=[];return t.map(function(t){t&&t[e]&&r.push(t[e])}),r},s.getItemsFromArrayByKeys=function(t,e,r){t instanceof Array||(t=[t]),e instanceof Array||(e=[e]);var n=[];return t.map(function(t){var o={};e.map(function(e){t&&e&&(r?o[e]=t[e]:t[e]&&(o[e]=t[e]))}),n.push(o)}),n},s.getAttrsFromObjectByKeys=function(t,e,r){if(e instanceof Array){var n=[],o={};return e.map(function(e){t&&e&&(r?t[e]&&(o[e]=t[e]):o[e]=t[e])}),n.push(o),n}if(t&&e)return t[e]};s.sortArrayByChar=function(t,e){return t.sort(function(t,r){var n,o;e&&e.useAttribute?(n=(""+s.getAttribute(t,e.useAttribute)).split(""),o=(""+s.getAttribute(r,e.useAttribute)).split("")):(n=(""+t).split(""),o=(""+r).split(""));for(var i=0;i<n.length;i++){if(void 0===o[i])return 1;if(n[i]!=o[i]){var u="123456789ABCDE".indexOf(n[i]),a="123456789ABCDE".indexOf(o[i]);if(-1==u&&-1==a)return n[i]>o[i]?1:-1;if(-1!=u&&-1==a)return 1;if(-1==u&&-1!=a)return-1;if(u>a)return 1}}return-1})},s.sortArrayByNumber=function(t,e){return t.sort(function(t,r){return e&&e.useAttribute&&(t=t[e.useAttribute],r=r[e.useAttribute]),e&&"descending"==e.dir?t<r?1:-1:r<t?1:-1})},s.isNum=function(t){return""!==t&&/^\d*$/.test(t)},s.createUUID=function(){var t=new Date(1582,10,15,0,0,0,0),e=(new Date).getTime()-t.getTime();return s._UUID_getIntegerBits(e,0,31)+s._UUID_getIntegerBits(e,32,47)+(s._UUID_getIntegerBits(e,48,59)+"1")+s._UUID_getIntegerBits(s._UUID_rand(4095),0,7)+s._UUID_getIntegerBits(s._UUID_rand(4095),0,7)+(s._UUID_getIntegerBits(s._UUID_rand(8191),0,7)+s._UUID_getIntegerBits(s._UUID_rand(8191),8,15)+s._UUID_getIntegerBits(s._UUID_rand(8191),0,7)+s._UUID_getIntegerBits(s._UUID_rand(8191),8,15)+s._UUID_getIntegerBits(s._UUID_rand(8191),0,15))},s._UUID_getIntegerBits=function(t,e,r){var n=s._UUID_returnBase(t,16),o=[],i="",u=0;for(u=0;u<n.length;u++)o.push(n.substring(u,u+1));for(u=Math.floor(e/4);u<=Math.floor(r/4);u++)o[u]&&""!=o[u]?i+=o[u]:i+="0";return i},s._UUID_returnBase=function(t,e){return t.toString(e).toUpperCase()},s._UUID_rand=function(t){return Math.floor(u.random()*(t+1))},s.toFixed=function(t,e,r){if(r)return t.toFixed(e);var n=t.toString(),o=n.indexOf(".");return-1==o?n:n.length>o+e+1?t.toFixed(e):n},s.normalizeColor=function(t,e){"string"==typeof t&&(-1!=t.indexOf(" ")?t=t.split(" "):-1!=t.indexOf(",")&&(t=t.split(",")));var r=[t[0],t[1],t[2],t[3]];return void 0===e&&t[0]<=1&&t[1]<=1&&t[2]<=1&&(e=1),1!=e&&(r[0]=(r[0]/255).toFixed(3),r[1]=(r[1]/255).toFixed(3),r[2]=(r[2]/255).toFixed(3),void 0!==r[3]&&(r[3]=(r[3]/255).toFixed(3))),void 0===r[3]&&(r[3]=1),r},s.parseWebColor=function(t,e){"string"==typeof t&&(-1!=t.indexOf(" ")?t=t.split(" "):-1!=t.indexOf(",")&&(t=t.split(","))),void 0===e&&t[0]<=1&&t[1]<=1&&t[2]<=1&&(e=1);var r=[t[0],t[1],t[2]];1==e&&(r[0]=Math.round(255*r[0]),r[1]=Math.round(255*r[1]),r[2]=Math.round(255*r[2]));for(var n="#",o=0;o<r.length;o++){var i=Number(r[o]).toString(16),u=Number(i);isNaN(u)?1==i.length&&(i="0"+i):u<10&&(i="0"+i),n+=i}return n},s.toHexString=function(t){if("string"==typeof t){var e=t.split("#");e=e[1];var r=[0,0,0];return r[0]=parseInt(e.substr(0,2),16)/255,r[1]=parseInt(e.substr(2,2),16)/255,r[2]=parseInt(e.substr(4,2),16)/255,r}return[0,0,0]},s.delSpaceCharacter=function(t){for(var e=new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）%％|【】‘；：”“'。，、？-]"),r="",n=0;n<t.length;n++)r+=t.substr(n,1).replace(e,"");return r=(r=r.replace("\\","")).replace(/\s/gi,"")},s.replaceMark=function(t,e){for(var r=new RegExp("[`~^*=|{}<>￥……*|‘”“']"),n="",o=0;o<t.length;o++)n=(n+=t.substr(o,1).replace(r,"")).replace("-",""),e||(n=n.replace(" ",""));return n},s.testMark=function(t){return new RegExp("[`~^*|{}<>￥……*|‘”“]").test(t)},s.delSpace=function(t){return t=(t=(t=t.replace(/\s/gi,"")).replace(/'/gi,"")).replace(/"/gi,"")},s.base64Encode=function(t){var e,r,n,o,i,u,a="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";for(n=t.length,r=0,e="";r<n;){if(o=255&t.charCodeAt(r++),r==n){e+=a.charAt(o>>2),e+=a.charAt((3&o)<<4),e+="==";break}if(i=t.charCodeAt(r++),r==n){e+=a.charAt(o>>2),e+=a.charAt((3&o)<<4|(240&i)>>4),e+=a.charAt((15&i)<<2),e+="=";break}u=t.charCodeAt(r++),e+=a.charAt(o>>2),e+=a.charAt((3&o)<<4|(240&i)>>4),e+=a.charAt((15&i)<<2|(192&u)>>6),e+=a.charAt(63&u)}return e},s.flatten=function t(e){return e.reduce(function(e,r){return e.concat(Array.isArray(r)?t(r):r)},[])},s.dataURLtoBlob=function(t){for(var e=t.split(","),r=e[0].match(/:(.*?);/)[1],n=atob(e[1].replace(/\s/g,"")),o=n.length,i=new Uint8Array(o);o--;)i[o]=n.charCodeAt(o);return new Blob([i],{type:r})};var p=s;u.util=p,u.hash=c;e.default=u},function(t,e,r){"use strict";(function(t,e){"undefined"==typeof window&&(window="object"==typeof t&&"object"==typeof e?e:void 0),Object.values||(Object.values=function(t){if(t!==Object(t))throw new TypeError("Object.values called on a non-object");var e,r=[];for(e in t)Object.prototype.hasOwnProperty.call(t,e)&&r.push(t[e]);return r}),String.prototype.startsWith||(String.prototype.startsWith=function(t){return this.substring(0,t.length)==t}),String.prototype.endsWith||(String.prototype.endsWith=function(t){return this.substring(this.length-t.length)==t}),String.prototype.trim||(String.prototype.trim=function(){return this.replace(/^\s*|\s*$/g,"")}),String.prototype.has||(String.prototype.has=function(t){return-1!=this.indexOf(t)}),String.prototype.replaceAll||(String.prototype.replaceAll=function(t,e){var r=new RegExp(t.replace(/([\(\)\[\]\{\}\^\$\+\-\*\?\.\"\'\|\/\\])/g,"\\$1"),"ig");return this.replace(r,e)}),String.prototype.includes||(String.prototype.includes=function(t,e){return"number"!=typeof e&&(e=0),!(e+t.length>this.length)&&-1!==this.indexOf(t,e)}),Array.prototype.includes||Object.defineProperty(Array.prototype,"includes",{value:function(t,e){if(null==this)throw new TypeError('"this" is null or not defined');var r=Object(this),n=r.length>>>0;if(0===n)return!1;var o,i,u=0|e,a=Math.max(u>=0?u:n-Math.abs(u),0);for(;a<n;){if((o=r[a])===(i=t)||"number"==typeof o&&"number"==typeof i&&isNaN(o)&&isNaN(i))return!0;a++}return!1}}),Number.prototype.toFixed=function(t){if(t||(t=0),-1==(e=this+"").indexOf(".")&&(e+="."),e+=new Array(t+1).join("0"),new RegExp("^(-|\\+)?(\\d+(\\.\\d{0,"+(t+1)+"})?)\\d*$").test(e)){var e="0"+RegExp.$2,r=RegExp.$1,n=RegExp.$3.length,o=!0;if(n==t+2){if(n=e.match(/\d/g),parseInt(n[n.length-1])>4)for(var i=n.length-2;i>=0&&(n[i]=parseInt(n[i])+1,10==n[i]);i--)n[i]=0,o=1!=i;e=n.join("").replace(new RegExp("(\\d+)(\\d{"+t+"})\\d$"),"$1.$2")}return o&&(e=e.substr(1)),(r+e).replace(/\.$/,"")}return this+""},Date.prototype.format||(Date.prototype.format=function(t){var e={"M+":this.getMonth()+1,"d+":this.getDate(),"H+":this.getHours(),"m+":this.getMinutes(),"s+":this.getSeconds(),"q+":Math.floor((this.getMonth()+3)/3),S:this.getMilliseconds()},r=this.getFullYear()+"";for(var n in r=r.length>=4?r:"0000".substr(0,4-r.length)+r,/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(r+"").substr(4-RegExp.$1.length))),e)new RegExp("("+n+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?e[n]:("00"+e[n]).substr((""+e[n]).length)));return t}),Object.values||(Object.values=function(t){if(t!==Object(t))throw new TypeError("Object.values called on a non-object");var e,r=[];for(e in t)Object.prototype.hasOwnProperty.call(t,e)&&r.push(t[e]);return r}),function(){for(var t=0,e=["webkit","moz"],r=0;r<e.length&&!window.requestAnimationFrame;++r)window.requestAnimationFrame=window[e[r]+"RequestAnimationFrame"],window.cancelAnimationFrame=window[e[r]+"CancelAnimationFrame"]||window[e[r]+"CancelRequestAnimationFrame"];window.requestAnimationFrame||(window.requestAnimationFrame=function(e){var r=(new Date).getTime(),n=Math.max(0,16-(r-t)),o=window.setTimeout(function(){e(r+n)},n);return t=r+n,o}),window.cancelAnimationFrame||(window.cancelAnimationFrame=function(t){clearTimeout(t)})}()}).call(this,r(2),r(3))},function(t,e){var r,n,o=t.exports={};function i(){throw new Error("setTimeout has not been defined")}function u(){throw new Error("clearTimeout has not been defined")}function a(t){if(r===setTimeout)return setTimeout(t,0);if((r===i||!r)&&setTimeout)return r=setTimeout,setTimeout(t,0);try{return r(t,0)}catch(e){try{return r.call(null,t,0)}catch(e){return r.call(this,t,0)}}}!function(){try{r="function"==typeof setTimeout?setTimeout:i}catch(t){r=i}try{n="function"==typeof clearTimeout?clearTimeout:u}catch(t){n=u}}();var c,s=[],f=!1,l=-1;function p(){f&&c&&(f=!1,c.length?s=c.concat(s):l=-1,s.length&&d())}function d(){if(!f){var t=a(p);f=!0;for(var e=s.length;e;){for(c=s,s=[];++l<e;)c&&c[l].run();l=-1,e=s.length}c=null,f=!1,function(t){if(n===clearTimeout)return clearTimeout(t);if((n===u||!n)&&clearTimeout)return n=clearTimeout,clearTimeout(t);try{n(t)}catch(e){try{return n.call(null,t)}catch(e){return n.call(this,t)}}}(t)}}function g(t,e){this.fun=t,this.array=e}function h(){}o.nextTick=function(t){var e=new Array(arguments.length-1);if(arguments.length>1)for(var r=1;r<arguments.length;r++)e[r-1]=arguments[r];s.push(new g(t,e)),1!==s.length||f||a(d)},g.prototype.run=function(){this.fun.apply(null,this.array)},o.title="browser",o.browser=!0,o.env={},o.argv=[],o.version="",o.versions={},o.on=h,o.addListener=h,o.once=h,o.off=h,o.removeListener=h,o.removeAllListeners=h,o.emit=h,o.prependListener=h,o.prependOnceListener=h,o.listeners=function(t){return[]},o.binding=function(t){throw new Error("process.binding is not supported")},o.cwd=function(){return"/"},o.chdir=function(t){throw new Error("process.chdir is not supported")},o.umask=function(){return 0}},function(t,e){var r;r=function(){return this}();try{r=r||new Function("return this")()}catch(t){"object"==typeof window&&(r=window)}t.exports=r}])});