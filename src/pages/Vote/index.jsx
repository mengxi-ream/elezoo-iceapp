import React from 'react';
import { ResponsiveGrid } from '@alifd/next';
import VoteBlock from './components/VoteBlock';

const { Cell } = ResponsiveGrid;

const Vote = () => (
  <ResponsiveGrid gap={20}>
    <Cell colSpan={12}>
      <VoteBlock />
    </Cell>
  </ResponsiveGrid>
);

export default Vote;
