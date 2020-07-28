import React from 'react';
import { ResponsiveGrid } from '@alifd/next';
import VoteProposeBlock from './components/VoteProposeBlock';

const { Cell } = ResponsiveGrid;

const Vote = () => (
  <ResponsiveGrid gap={20}>
    <Cell colSpan={12}>
      <VoteProposeBlock />
    </Cell>
  </ResponsiveGrid>
);

export default Vote;
