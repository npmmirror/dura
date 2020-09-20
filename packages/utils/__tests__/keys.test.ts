import { keys } from '../src';

describe('test keys', function () {
  it('test keys', function () {
    const target = {
      a: 1,
      b: 2,
    };

    expect(keys(target)).toEqual(['a', 'b']);
  });
});
