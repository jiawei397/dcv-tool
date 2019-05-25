import './polyfill';
import uinv from './uinv';
import util from './util';
import hash from './hash';
import {version} from '../../package.json';
uinv.util = util;
uinv.hash = hash;
uinv.VERSION = version;

export default uinv;
