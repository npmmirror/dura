import { throttleDispatch } from '../src/throttleDispatch';
import type { ThrottleSettings } from '@dura/types';

describe('test throttleDispatch', function () {
  it('test plain throttle', function (done) {
    const cache = new Map<string, any>();
    const type = 'test';
    const meta = {
      wait: 500,
    };
    let name = 'default';

    expect(name).toEqual('default');
    throttleDispatch(cache, type, meta, () => {
      name = '1';
    });
    throttleDispatch(cache, type, meta, () => {
      name = '2';
    });
    throttleDispatch(cache, type, meta, () => {
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
      throttleDispatch(cache, type, meta, () => {
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
    throttleDispatch(cache, type, meta, () => {
      name = '1';
    });
    throttleDispatch(cache, type, meta, () => {
      name = '2';
    });
    throttleDispatch(cache, type, meta, () => {
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
      throttleDispatch(cache, type, meta, () => {
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
