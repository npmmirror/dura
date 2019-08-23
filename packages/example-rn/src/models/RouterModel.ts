import { EffectApi } from "@dura/plus";
import { actionCreator } from "../store";


const initialState = {
  
};

type State = typeof initialState;

export default {
  state: initialState,
  reducers: {
    
  },
  effects: {
    async pushUserPage(effectApi,action:{
        payload:{
            navigation:any
        }
    }){
        console.log(action.payload.navigation)
        action.payload.navigation.push('User')
    } 
  }
};
