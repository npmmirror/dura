import React from 'react';
import { Image, Button } from 'antd';

export default function() {
  const baseUrl =
    'https://dura.oss-cn-hangzhou.aliyuncs.com/example/0E2B97A5-36D5-4914-BF3B-2C8A62819C58.png';
  const size = { width: 400, height: 400 };
  return (
    <>
      <Image
        {...size}
        placeholder={
          <Image
            {...size}
            src={`${baseUrl}?x-oss-process=image/blur,r_50,s_50/quality,q_40/resize,m_mfit,h_200,w_200`}
          />
        }
        src={`https://dura.oss-cn-hangzhou.aliyuncs.com/example/0E2B97A5-36D5-4914-BF3B-2C8A62819C58.png`}
      />
    </>
  );
}
