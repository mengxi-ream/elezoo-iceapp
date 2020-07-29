import React from 'react';
import { ResponsiveGrid } from '@alifd/next';
import VoteVoteBlock from './components/VoteVoteBlock';

const { Cell } = ResponsiveGrid;

const VoteNotStarted = () => (
  <ResponsiveGrid gap={20}>
    <Cell colSpan={12}>
      <VoteVoteBlock />
    </Cell>
  </ResponsiveGrid>
);

export default VoteNotStarted;
