import utils from './utils';
import util from './util';
import image from './image';
import {hash} from '../common';

hash.combineNew(util, utils.util);
utils.image = image;
utils.util = util;

export default utils;
export {util, image, hash};
