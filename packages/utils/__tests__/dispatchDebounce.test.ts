import { dispatchDebounce } from '../src';

describe('test debounceDispatch', function () {
  it('test plain', function (done) {
    const cache = new Map<string, any>();
    const type = 'test';
    const meta = {
      wait: 500,
    };
    let name = 'default';

    expect(name).toEqual('default');
    dispatchDebounce(cache, type, 500, () => {
      name = '1';
    });
    dispatchDebounce(cache, type, 500, () => {
      name = '2';
    });
    dispatchDebounce(cache, type, meta, () => {
      name = '3';
    });
    expect(name).toEqual('default');
    expect(cache.size).toEqual(2);
    expect(cache.has('test/debounce')).toBeTruthy();
    expect(cache.has('test/debounce/clear')).toBeTruthy();
    setTimeout(() => {
      expect(name).toEqual('3');
      expect(cache.size).toEqual(0);
      expect(cache.has('test/debounce')).toBeFalsy();
      expect(cache.has('test/debounce/clear')).toBeFalsy();
      done();
    }, 3000);
  });

  it('test iife plain', function (done) {
    const cache = new Map<string, any>();
    const type = 'test';
    const meta = {
      wait: 500,
      iife: true,
    };
    let name = 'default';

    expect(name).toEqual('default');
    dispatchDebounce(cache, type, meta, () => {
      name = '1';
    });
    dispatchDebounce(cache, type, meta, () => {
      name = '2';
    });
    dispatchDebounce(cache, type, meta, () => {
      name = '3';
    });

    setTimeout(() => {
      dispatchDebounce(cache, type, meta, () => {
        name = '4';
      });
      expect(name).toEqual('4');
      setTimeout(() => {
        expect(cache.size).toEqual(0);
        expect(cache.has('test/debounce')).toBeFalsy();
        expect(cache.has('test/debounce/clear')).toBeFalsy();
        done();
      }, 500);
    }, 2000);

    expect(name).toEqual('1');
    expect(cache.size).toEqual(2);
    expect(cache.has('test/debounce')).toBeTruthy();
    expect(cache.has('test/debounce/clear')).toBeTruthy();
    setTimeout(() => {
      expect(name).toEqual('3');
      expect(cache.size).toEqual(0);
      expect(cache.has('test/debounce')).toBeFalsy();
      expect(cache.has('test/debounce/clear')).toBeFalsy();
    }, 500);
  });
});
