import React from "react";
import { render } from "react-dom";
import produce, {
  enablePatches,
  setAutoFreeze
} from "immer";
import u from './models/user.model'
import { useVirtualList } from "@umijs/hooks"
import { createAppCreator, createProxy } from "./util/createApp";
import faker from 'faker'
import { times } from 'lodash'
// faker.setLocale('zh_CN')
faker.locale = 'zh_CN'

setAutoFreeze(false)
enablePatches();
// const createElement = React.createElement.bind(React);

// const ownAuthorityBtnList = ["addModel","delModel"]

// React.createElement = <T,P extends {[name:string]:any},C>(type:T,props:P,...children:C[]) => {

//   if (!props?.["data-authority"]) {
//     return createElement(type,props,...children)
//   }

//   if (ownAuthorityBtnList.includes(props?.["data-authority"])) {
//     return createElement(type,props,...children)
//   }
//   return null;
// };

const createApp = createAppCreator();

const app = createApp();

app.use(
  u,
  {
    namespace: "demo" as const,
    state: {
      users: [{ name: "张三", age: 12 }],
      name: "demo",
      age: 1,
    },
    reducers: {
      changeName(state, action) {
        state.users[0].name = "李四";

      },
      changeAge(state, action) {
        state.users[0].age = state.users[0].age + 1;

      },
    },
    effects: {
      async change(storeState,commit) {

      },
    },
  },
);
const { defineContainer, defineComponent, store } = app.run();

const s = {
  namespace:'sss',
  state:{
    hello:'hello'
  },
  reducers:{
    changeHello(state){
      state.hello = 'world'
    }
  },
  effects:{}
}



// const S = defineComponent(props => {

//   const { users} = props.store.user
//   const u = users.find(n => n.id === props?.id)
//   return (
//     <div key={u?.id}>
//       <span>{u?.name}</span>
//       <span style={{color:"#999",marginLeft:20}}>{u?.city}</span>
//     </div>
//   )
// })

const S = defineComponent(props => {


  

  return (
    <div key={props?.item?.id}>
      <span>{props?.item?.name}</span>
      <span style={{color:"#999",marginLeft:20}}>{props?.item?.city}</span>
    </div>
  )
})

const Item = defineComponent((props) => {
  console.log("我是上面的组件，我用到了name");
  const { users} = props.store.user

  
  // users.map(n => {
  //   console.log(n);
    
  // })
  

  return (
    <div>
      <h1>{props.store.demo.name}</h1>
      <h1>{props.store.demo.name}</h1>
      {
        users.map((n) =>  {
          return (<S item={n} key={n.id} />)
    //       return (
    //         <div key={n?.id}>
    //   <span>{n?.name}</span>
    //   <span style={{color:"#999",marginLeft:20}}>{n?.city}</span>
    // </div>
    //       )
        })
      }
      
      <span style={{display:"inline-block"}}>hello</span>
      <span style={{display:"inline-block"}}>world</span>
      <button
        onClick={() => {
          // store.dispatch({
          //   type: "demo/changeName",
          //   name: "李四",
          // });
          // app.use(s)
          store.dispatch({
            type: "user/push",
          });
        }}
      >
        改姓名
      </button>
      <button data-authority="delModel" onClick={() => {
        app.unUse(s.namespace)
      }}>删除model</button>
      <button data-authority="addModel" onClick={() => {
        app.use(s)
      }}>增加model</button>
      <button
        onClick={() => {
          store.dispatch({
            type: "demo/changeAge",
          });
        }}
      >
        改年龄
      </button>
    </div>
  );
});

const Item1 = defineComponent((props) => {
  console.log("我是下面的组件，我用到了age");
  return (
    <div>
      {/* <h1>{props.store.demo.users[0].age}</h1> */}
      <h1>{props.store.demo.users[0].age}</h1>
      <button
        onClick={() => {
          store.dispatch({
            type: "demo/changeName",
            name: "李四",
          });
        }}
      >
        改姓名
      </button>
      <button
        onClick={() => {
          store.dispatch({
            type: "demo/changeAge",
          });
        }}
      >
        改年龄
      </button>
      <button
        onClick={() => {
          store.dispatch({
            type: "demo/change",
            name: "李四",
          });
        }}
      >
        effect
      </button>
    </div>
  );
});


const users = times(4800).map(n => ({
  id:n,
  name: `${faker.name.firstName()}${faker.name.lastName()}`,
  city: faker.address.city(),
  streetAddress: faker.address.streetAddress()
}))

const App = defineContainer(() => {
  return (
    <div>
      <Item />
      <Item1 />
    </div>
  );
  // const [state,setState] = React.useState(users)
  // return (
  //   <div>
  //      {
  //       state.map((n) =>  {
  //         // return (<S item={n} key={n.id} />)
  //         return (
  //           <div key={n?.id}>
  //     <span>{n?.name}</span>
  //     <span style={{color:"#999",marginLeft:20}}>{n?.city}</span>
  //   </div>
  //         )
  //       })
  //     }
  //     <button
  //       onClick={() => {
          
  //         setState(s => {
  //           let _s = []
  //           s.forEach((k,i) =>{
  //             if (i !== 3999) {
  //               _s.push(k)
  //             }else{
  //               _s.push({...k,name:"xx"+Math.random()} )
  //             }
  //           })
  //           return _s;
  //         })
  //       }}
  //     >
  //       改姓名
  //     </button>
  //   </div>
  // )
});

if (document.querySelector("#app")) {
  render(<App />, document?.querySelector?.("#app"));
}
 