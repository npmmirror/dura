import { set } from '../src';

describe('test set', function () {
  it('test set', function () {
    let state = {};
    expect(state['a']?.['b']?.['c']?.['d']).toBeUndefined();
    set(state, ['a', 'b', 'c', 'd'], 12);
    expect(state['a']['b']['c']['d']).toEqual(12);
  });
});
