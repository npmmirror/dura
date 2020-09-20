import { merge } from '../src';

describe('test merge', function () {
  it('test merge', function () {
    const a = {
      a: 12,
    };
    const b = {
      b: 23,
    };

    expect(merge(a, b)).toEqual({ ...a, ...b });
  });
});
