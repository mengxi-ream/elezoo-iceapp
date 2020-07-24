import React from 'react';
import { Tab } from '@alifd/next';
import PageTab from '@/components/PageTab';
import MyVote from './MyVote';

const VoteBlock = () => {
  return (
    <PageTab>
      <Tab.Item title="我的投票" key="myVote">
        <MyVote />
      </Tab.Item>
      <Tab.Item title="创建投票" key="createVote">
        <MyVote />
      </Tab.Item>
      <Tab.Item title="加入投票" key="joinVote">
        <MyVote />
      </Tab.Item>
    </PageTab>
  );
};

export default VoteBlock;
