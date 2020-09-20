import {
  DURA_PATCHES_SYMBOL,
  DURA_STORE_EFFECTS,
  DURA_STORE_REDUCERS,
  DURA_SYMBOL,
} from '../src';

describe('test symbol', function () {
  it('test symbol', function () {
    expect(DURA_SYMBOL).toEqual(DURA_SYMBOL);
    expect(DURA_STORE_REDUCERS).toEqual(DURA_STORE_REDUCERS);
    expect(DURA_STORE_EFFECTS).toEqual(DURA_STORE_EFFECTS);
    expect(DURA_PATCHES_SYMBOL).toEqual(DURA_PATCHES_SYMBOL);
  });
});
