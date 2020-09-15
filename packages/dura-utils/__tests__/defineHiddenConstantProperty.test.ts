import { defineHiddenConstantProperty } from "../src";

describe("test defineHiddenConstantProperty", function () {
  it("test defineProperty", function () {
    const target = {
      name: "张三",
    };
    expect(target.name).toEqual("张三");
    expect(target["sex"]).toBeUndefined();
    defineHiddenConstantProperty(target, "sex", "男");
    expect(target["sex"]).toEqual("男");
  });
});
