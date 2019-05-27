import json from 'rollup-plugin-json';
import rollupTypescript from 'rollup-plugin-typescript';
import {uglify} from 'rollup-plugin-uglify'; //压缩bundle文件

const isProduction = process.env.NODE_ENV === 'production';
const isCommon = process.env.IS_COMMON === 'true';//是否只用公用模块，非浏览器

const input = isCommon ? 'src/common/index.ts' : 'src/browser/index.ts';

export default {
  input: input,
  output: {
    file: `lib/utils${isCommon ? '-common' : ''}.${isProduction ? 'min.' : ''}js`,
    format: 'umd',
    name: 'utils'
  },
  plugins: [
    rollupTypescript({declaration: false}),
    json(),
    (isProduction && uglify())
  ]
};
