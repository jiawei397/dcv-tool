import {assert} from 'chai';
import createUUID from '../../../src/common/uuid';

describe('uuid 验证', function () {
  it('createUUID() 验证', function () {
    let id = createUUID();
    assert.equal(id.length, 32);

    let id2 = createUUID();
    assert.notEqual(id, id2, '每次创建的都不一样');
  });
});
