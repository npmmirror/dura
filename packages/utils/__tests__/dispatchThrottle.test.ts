import { dispatchThrottle } from '../src';

describe('test throttleDispatch', function () {
  it('test plain throttle', function (done) {
    const cache = new Map<string, any>();
    const type = 'test';
    const meta = {
      wait: 500,
    };
    let name = 'default';

    expect(name).toEqual('default');
    dispatchThrottle(cache, type, 500, () => {
      name = '1';
    });
    dispatchThrottle(cache, type, 500, () => {
      name = '2';
    });
    dispatchThrottle(cache, type, 500, () => {
      name = '3';
    });
    expect(name).toEqual('default');
    expect(cache.size).toEqual(2);
    expect(cache.has('test/throttle')).toBeTruthy();
    expect(cache.has('test/throttle/clear')).toBeTruthy();
    setTimeout(() => {
      expect(name).toEqual('1');
      expect(cache.size).toEqual(0);
      expect(cache.has('test/throttle')).toBeFalsy();
      expect(cache.has('test/throttle/clear')).toBeFalsy();
    }, 500);

    setTimeout(() => {
      dispatchThrottle(cache, type, meta, () => {
        name = '4';
      });
      expect(name).toEqual('1');
      expect(cache.size).toEqual(2);
      expect(cache.has('test/throttle')).toBeTruthy();
      expect(cache.has('test/throttle/clear')).toBeTruthy();

      setTimeout(() => {
        expect(name).toEqual('4');
        expect(cache.size).toEqual(0);
        expect(cache.has('test/throttle')).toBeFalsy();
        expect(cache.has('test/throttle/clear')).toBeFalsy();
        done();
      }, 500);
    }, 500);
  });

  it('test iife throttle', function (done) {
    const cache = new Map<string, any>();
    const type = 'test';
    const meta = {
      wait: 500,
      iife: true,
    };
    let name = 'default';

    expect(name).toEqual('default');
    dispatchThrottle(cache, type, meta, () => {
      name = '1';
    });
    dispatchThrottle(cache, type, meta, () => {
      name = '2';
    });
    dispatchThrottle(cache, type, meta, () => {
      name = '3';
    });
    expect(name).toEqual('1');
    expect(cache.size).toEqual(2);
    expect(cache.has('test/throttle')).toBeTruthy();
    expect(cache.has('test/throttle/clear')).toBeTruthy();
    setTimeout(() => {
      expect(name).toEqual('1');
      expect(cache.size).toEqual(0);
      expect(cache.has('test/throttle')).toBeFalsy();
      expect(cache.has('test/throttle/clear')).toBeFalsy();
    }, 500);

    setTimeout(() => {
      dispatchThrottle(cache, type, meta, () => {
        name = '4';
      });
      expect(name).toEqual('4');
      expect(cache.size).toEqual(2);
      expect(cache.has('test/throttle')).toBeTruthy();
      expect(cache.has('test/throttle/clear')).toBeTruthy();

      setTimeout(() => {
        expect(name).toEqual('4');
        expect(cache.size).toEqual(0);
        expect(cache.has('test/throttle')).toBeFalsy();
        expect(cache.has('test/throttle/clear')).toBeFalsy();
        done();
      }, 500);
    }, 500);
  });
});
