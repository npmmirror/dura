'use strict';

var redux = require('redux');

function configura() {
  return function createStore() {
    var store = redux.createStore(redux.combineReducers({}));
  };
}

var index = {
  configura: configura,
};

module.exports = index;
