import React, { useState } from 'react';
import { Tab } from '@alifd/next';
import PageTab from '@/components/PageTab';
import UpdateBasic from './UpdateBasic';
import UpdatePsw from './UpdatePsw';

const SettingBlock = () => {
  return (
    <PageTab>
      <Tab.Item title="基础设置" key="basic">
        <UpdateBasic />
      </Tab.Item>
      <Tab.Item title="修改密码" key="password">
        <UpdatePsw />
      </Tab.Item>
    </PageTab>
  );
};

export default SettingBlock;
