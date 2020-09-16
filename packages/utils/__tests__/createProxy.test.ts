import { createProxy, DURA_SYMBOL } from "../src";
describe("test createProxy", function () {
  it("test proxy", function () {
    const target = {
      name: "张三",
      orderList: [
        {
          id: 1,
          skuList: [
            {
              id: 11,
              name: "小浣熊",
            },
          ],
        },
      ],
    };
    const deps = new Map();
    const proxy = createProxy(target, deps, void 0);
    expect(deps.size).toEqual(0);
    proxy.name;
    expect(deps.size).toEqual(1);
    expect(deps.has("name")).toEqual(true);
    proxy.orderList[0].id;
    expect(deps.size).toEqual(2);
    expect(deps.has("orderList.0.id")).toEqual(true);
    expect(proxy.toString()).toEqual("[object Object]");
    expect(proxy.orderList[DURA_SYMBOL]).toEqual(1);
    proxy.orderList[0].id;
    expect(deps.size).toEqual(2);
    expect(deps.has("orderList.0.id")).toEqual(true);
    expect(deps.get("orderList.0.id")).toEqual(2);
  });
});
