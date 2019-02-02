# dura-async

async 插件主要用来处理异步 Action， 采用 **async await** 的方式来处理

```javascript
import { createAsyncPlugin } from "@dura/async";

//创建async插件
const asyncPlugn = createAsyncPlugin();
```

**注意，如果没有使用本插件，默认情况下 @dura/core 并不提供处理异步 Action 的能力，也就是说不具备 effects 的处理能力**

## 类型系统

### AsyncDuraStore

async 插件默认提供了 AsyncDuraStore 类型 ， 当使用的 async 插件之后， 那么在 store 中其实会绑定一个属性：**effectRunner** ， 所有的异步 Action 将由这个字段进行统一的调度 ， 而 AsyncDuraStore 类型， 则是为了提供 友好的 ts 提示而存在的

```javascript
import { create } from "@dura/core";
import { createAsyncPlugin, AsyncDuraStore } from "@dura/async";
import UserModel from "@models/UserModel";


const initialModel = {
  /**
   * 用户模块
   */
  user: UserModel
};

export type RootModel = typeof initialModel;

export const store = create({
  initialModel,
  plugins: [createAsyncPlugin()]
}) as DuraStore<RootModel> & AsyncDuraStore<RootModel> ;

// 由于使用了 AsyncDuraStore 类型系统，所以下面的调用都会有友好的提示信息
store.effectRunner.user.xxxx();

```

### EffectAPI

该类型提供主要用来提示 在 effects 的内嵌函数中，系统将会注入哪些 api

```javascript

const initialState = {
  /**
   * 姓名
   */
  name: "默认姓名" as string,
  /**
   * 性别
   */
  sex: undefined as "男" | "女",
  /**
   * 年龄
   */
  age: undefined as number
};

type State = typeof initialState;

export default {
  state: initialState,
  reducers: {
    /**
     *
     * @param payload 同步修改姓名
     */
    onChangeName(payload: { newName: string }) {
      return function(state: State): State {
        state.name = payload.newName + "9";
        return state;
      };
    }
  },
  effects: {
    /**
     * 异步修改姓名
     * @param payload
     */
    onAsyncChangeName(payload: { newName: string }, meta: LoadingMeta) {
      return async function(effectApi: EffectAPI<RootModel>) {
        await effectApi.delay(5500);
        reducerRunner.user.onChangeName(payload);
      };
    }
  }
};

```
