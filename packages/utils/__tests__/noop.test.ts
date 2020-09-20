import { noop } from '../src';

describe('test noop', function () {
  it('test noop', function () {
    expect(noop()).toEqual({});
  });
});
