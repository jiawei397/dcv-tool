import './polyfill';
import utils from './utils';
import util from './util';
import hash from './hash';
import {version} from '../../package.json';

utils.util = util;
utils.hash = hash;
utils.VERSION = version;

export default utils;
export {util, hash};
