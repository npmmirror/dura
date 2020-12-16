import { createStore, combineReducers } from 'redux';

function configura() {
  return function createStore$1() {
    var store = createStore(combineReducers({}));
  };
}

var index = {
  configura: configura,
};

export default index;
