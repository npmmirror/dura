import React, { useState, useEffect } from 'react';
import { render } from 'react-dom';
import { Space, Button } from 'antd';
import { defineContainer } from './store';
import Block1 from './components/Block1';
import Block2 from './components/Block2';
import Block3 from './components/Block3';

const world = 'world';
window.onbeforeunload = function (e) {
  // Cancel the event
  e.preventDefault();
  console.log('用户想关闭');
  // Chrome requires returnValue to be set
  e.returnValue = 'Really want to quit the game?';
  return 'xxx';
};
function useContainer() {
  useEffect(() => {
    window.addEventListener('keydown', (e) => {
      const metaKey = e.metaKey;
      const ctrlKey = e.ctrlKey;
      const keyCode = e.keyCode;
      const wKeyCode = 87;
      console.log(e, keyCode, metaKey, ctrlKey);

      if ((metaKey && keyCode === 119) || (ctrlKey && keyCode === wKeyCode)) {
        console.log('用户想关闭');
        e.preventDefault();
        e.stopPropagation();
        e.returnValue = false;
        return false;
      }
    });
  }, []);

  const [v, setV] = useState(false);

  useEffect(() => {
    if (v) {
      document.documentElement.scrollTop =
        document.documentElement.scrollHeight;
    } else {
      document.documentElement.scrollTop = 0;
    }
  }, [v]);

  useEffect(() => {
    console.log(document.querySelector('#test')?.childNodes);
  }, []);

  return { v, setV };
}

const App = defineContainer(() => {
  const { v, setV } = useContainer();

  return (
    <div style={{ margin: '0px auto' }}>
      <div style={{ position: 'fixed', right: 20, bottom: 20, width: 160 }}>
        <Button type="primary" onClick={() => setV(!v)} shape="round">
          {`${v ? '上去' : '下去'}`}
        </Button>
      </div>
      <div style={{ height: 100, width: '100%' }}></div>
      <Block1 />
      <Block2 />
      <Block3 />
      <span id="test">hello:{world}</span>
    </div>
  );
});

if (document.querySelector('#app')) {
  render(<App />, document?.querySelector?.('#app'));
}

/**
 *
 * const configuration = configure(middlewares,enhancers,onError,plugins)
 *
 * const store = configuration.createStore(initialState,extraReducers)
 *
 * store.use(xxxModel)
 *
 * store.run()
 *
 * store.unUse(xxxModelNameSpace)
 *
 * const users = store.getState().users
 *
 * const manUsers = users.filter(n => n.sex === 1)
 *                    .map(n => (n.name = 'xxx') )
 *
 * const manUsers = users.filter(n => n.sex === 1)
 *                    .map(n => ({...n,name : 'xxx'}) )
 *
 * <Provider>
 *
 *  <SearchTable>
 * </SearchTable>
 *
 *  <SearchList>
 * </SearchList>
 *
 *
 * <Provider>
 *
 *
 */
