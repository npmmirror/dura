import { dispatchLoading } from '../src';

describe('test throttleDispatch', function () {
  it('test plain loading', function (done) {
    const type = 'test';
    let name = 'default';
    let loading = {};
    const reduxStore = {
      dispatch: function (action) {
        if (action.type === 'DURA/CHANGE_LOADING') {
          loading[action.payload.k] = action.payload.v;
        }
      },
    };
    const deloy = (ms: number) =>
      new Promise((resolve, reject) => setTimeout(resolve, ms));

    dispatchLoading(reduxStore as any, type, true, async () => {
      await deloy(1000);
      name = 'xx';
    });

    expect(Object.keys(loading).length).toEqual(1);
    expect(loading[`${type}/default`].status).toEqual(true);
    expect(name).toEqual('default');

    setTimeout(() => {
      expect(loading[`${type}/default`].status).toEqual(false);
      expect(name).toEqual('xx');
      done();
    }, 1001);
  });

  it('test customize loading', function (done) {
    const type = 'test';
    let name = 'default';
    let loading = {};
    const id = 12;
    const reduxStore = {
      dispatch: function (action) {
        if (action.type === 'DURA/CHANGE_LOADING') {
          loading[action.payload.k] = action.payload.v;
        }
      },
    };
    const deloy = (ms: number) =>
      new Promise((resolve, reject) => setTimeout(resolve, ms));

    dispatchLoading(reduxStore as any, type, id, async () => {
      await deloy(1000);
      name = 'xx';
    });
    expect(Object.keys(loading).length).toEqual(1);
    expect(loading[`${type}/${id}`].status).toEqual(true);
    expect(name).toEqual('default');

    setTimeout(() => {
      expect(loading[`${type}/${id}`].status).toEqual(false);
      expect(name).toEqual('xx');
      done();
    }, 1001);
  });

  it('test error loading', function (done) {
    const type = 'test';
    let name = 'default';
    let loading = {};
    const reduxStore = {
      dispatch: function (action) {
        if (action.type === 'DURA/CHANGE_LOADING') {
          loading[action.payload.k] = action.payload.v;
        }
      },
    };
    const deloy = (ms: number) =>
      new Promise((resolve, reject) => setTimeout(resolve, ms));

    dispatchLoading(reduxStore as any, type, true, async () => {
      await deloy(1000);
      throw Error('error1111');
      name = 'xx';
    });
    expect(Object.keys(loading).length).toEqual(1);
    expect(loading[`${type}/default`].status).toEqual(true);
    expect(name).toEqual('default');

    setTimeout(() => {
      expect(loading[`${type}/default`].status).toEqual(false);
      expect(loading[`${type}/default`].error.message).toEqual('error1111');

      expect(name).toEqual('default');
      done();
    }, 1001);
  });
});
