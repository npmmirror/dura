import { merge, delay, noop } from "../src";

describe("util测试用例", () => {
  it("空对象函数", () => {
    expect(noop()).toEqual({});
  });
  it("merge", () => {
    const a = { a: 12 };
    const b = { b: 21 };
    expect(merge(a, b)).toEqual({ a: 12, b: 21 });
  });
  it("超时", function (done) {
    let s = false;
    const _ = async () => {
      await delay(200);
      s = true;
    };
    _();

    setTimeout(() => {
      expect(s).toEqual(true);
      done();
    }, 300);
  });
});
