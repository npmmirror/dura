import React from 'react';
import { Spin } from 'antd';
export default () => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: 600,
      }}
    >
      <Spin delay={20} size="large" />
    </div>
  );
};
