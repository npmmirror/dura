import React, { useState, useEffect } from 'react';
import { render } from 'react-dom';
import { Space, Button } from 'antd';
import { defineContainer } from './store';
import Block1 from './components/Block1';
import Block2 from './components/Block2';
import Block3 from './components/Block3';

function useContainer() {
  const [v, setV] = useState(false);

  useEffect(() => {
    if (v) {
      document.documentElement.scrollTop =
        document.documentElement.scrollHeight;
    } else {
      document.documentElement.scrollTop = 0;
    }
  }, [v]);
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
      <Space>
        <Block2 />
        <Block1 />
        <Block3 />
      </Space>
    </div>
  );
});

if (document.querySelector('#app')) {
  render(<App />, document?.querySelector?.('#app'));
}
