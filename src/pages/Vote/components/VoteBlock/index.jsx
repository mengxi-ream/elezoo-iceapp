import React from 'react';
import { Tab } from '@alifd/next';
import PageTab from '@/components/PageTab';
import MyVote from './MyVote';
import CreateVote from './CreateVote';
import JoinVote from './JoinVote';

const VoteBlock = () => {
  return (
    <PageTab>
      <Tab.Item title="我的投票" key="myVote">
        <MyVote />
      </Tab.Item>
      <Tab.Item title="创建投票" key="createVote">
        <CreateVote />
      </Tab.Item>
      <Tab.Item title="加入投票" key="joinVote">
        <JoinVote />
      </Tab.Item>
    </PageTab>
  );
};

export default VoteBlock;
