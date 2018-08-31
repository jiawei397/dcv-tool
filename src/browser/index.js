import './polyfill';
import uinv, {Q, u} from '../common';
import uinv2 from './uinv_browser';
import eventEmitter from './event';
const merge = require('merge');

merge(uinv, uinv2);

uinv.eventEmitter = eventEmitter;

export {uinv, Q, u};
