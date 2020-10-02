import { dispatchThrottle } from '../src';

describe('test throttleDispatch', function () {
  it('test plain throttle', function (done) {
    const cache = new Map<string, any>();
    const type = 'test';
    const meta = {
      wait: 500,
    };
    let name = 'default';
    const dispatch = (nextName) => {
      name = nextName;
    };
    expect(name).toEqual('default');
    dispatchThrottle(cache, type, 500, dispatch)(1);
    dispatchThrottle(cache, type, 500, dispatch)(2);
    dispatchThrottle(cache, type, 500, dispatch)(3);
    expect(name).toEqual(1);
    expect(cache.size).toEqual(2);
    expect(cache.has('test/throttle')).toBeTruthy();
    expect(cache.has('test/throttle/clear')).toBeTruthy();

    setTimeout(() => {
      expect(name).toEqual(3);
      expect(cache.size).toEqual(0);
      expect(cache.has('test/throttle')).toBeFalsy();
      expect(cache.has('test/throttle/clear')).toBeFalsy();
    }, 510);

    setTimeout(() => {
      dispatchThrottle(cache, type, 500, dispatch)(4);
      expect(name).toEqual(4);
      expect(cache.size).toEqual(2);
      expect(cache.has('test/throttle')).toBeTruthy();
      expect(cache.has('test/throttle/clear')).toBeTruthy();

      setTimeout(() => {
        expect(name).toEqual(4);
        expect(cache.size).toEqual(0);
        expect(cache.has('test/throttle')).toBeFalsy();
        expect(cache.has('test/throttle/clear')).toBeFalsy();
        done();
      }, 510);
    }, 510);
  });

  it('test iife throttle', function (done) {
    const cache = new Map<string, any>();
    const type = 'test';
    const meta = {
      wait: 500,
      iife: true,
    };
    const dispatch = (nextName) => {
      name = nextName;
    };
    let name = 'default';

    expect(name).toEqual('default');
    dispatchThrottle(cache, type, meta, dispatch)(1);
    dispatchThrottle(cache, type, meta, dispatch)(2);
    dispatchThrottle(cache, type, meta, dispatch)(3);
    expect(name).toEqual(1);
    expect(cache.size).toEqual(2);
    expect(cache.has('test/throttle')).toBeTruthy();
    expect(cache.has('test/throttle/clear')).toBeTruthy();
    setTimeout(() => {
      expect(name).toEqual(3);
      expect(cache.size).toEqual(0);
      expect(cache.has('test/throttle')).toBeFalsy();
      expect(cache.has('test/throttle/clear')).toBeFalsy();
    }, 510);

    setTimeout(() => {
      dispatchThrottle(cache, type, meta, dispatch)(4);
      expect(name).toEqual(4);
      expect(cache.size).toEqual(2);
      expect(cache.has('test/throttle')).toBeTruthy();
      expect(cache.has('test/throttle/clear')).toBeTruthy();

      setTimeout(() => {
        expect(name).toEqual(4);
        expect(cache.size).toEqual(0);
        expect(cache.has('test/throttle')).toBeFalsy();
        expect(cache.has('test/throttle/clear')).toBeFalsy();
        done();
      }, 512);
    }, 510);
  });
});
