import React from 'react';
import { render } from 'react-dom';
import faker from 'faker';
import { Button, Card } from 'antd';
import { store, defineContainer, defineComponent } from './store';
import Block1 from './components/Block1';
import Block2 from './components/Block2';
import Block3 from './components/Block3';

const App = defineContainer(() => {
  console.log('app');
  return (
    <div style={{ margin: '0px auto' }}>
      <Block1 />
      <Block2 />
      <Block3 />
    </div>
  );
});

if (document.querySelector('#app')) {
  render(<App />, document?.querySelector?.('#app'));
}
