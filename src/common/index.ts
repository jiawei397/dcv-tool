import './polyfill';
import uinv from './uinv';
import util from './util';
import hash from './hash';

uinv.VERSION = '${VERSION}';
uinv.util = util;
uinv.hash = hash;

export default uinv;
