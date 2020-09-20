import { createAsyncMiddleware } from '../src';
import { applyMiddleware, createStore, combineReducers } from 'redux';

describe('test dura-async', function () {
  it('test async middleware', function () {
    let name = undefined;
    const effects = {
      user: {
        onAsync(a) {
          name = a.payload.name;
        },
      },
    };

    const getEffects = (namespace, methodName) =>
      effects[namespace][methodName];

    const store = createStore(
      combineReducers({
        user: function (state = { name: '张三' }, action) {
          return state;
        },
      }),
      applyMiddleware(createAsyncMiddleware(getEffects)),
    );

    expect(name).toBeUndefined();

    store.dispatch({ type: 'user/onAsync', payload: { name: 'xx' } });

    expect(name).toEqual('xx');
  });

  it('test not exits async ', function () {
    let name = undefined;
    const effects = {
      user: {
        onAsync(a) {
          name = a.payload.name;
        },
      },
    };

    const getEffects = (namespace, methodName) =>
      effects[namespace][methodName];

    const store = createStore(
      combineReducers({
        user: function (state = { name: '张三' }, action) {
          return state;
        },
      }),
      applyMiddleware(createAsyncMiddleware(getEffects)),
    );

    expect(name).toBeUndefined();

    store.dispatch({ type: 'user/onAsync1', payload: { name: 'xx' } });

    expect(name).toBeUndefined();
  });
});
