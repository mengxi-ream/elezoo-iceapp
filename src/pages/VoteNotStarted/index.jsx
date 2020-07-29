import React from 'react';
import { ResponsiveGrid } from '@alifd/next';
import VoteNotStartedBlock from './components/VoteNotStartedBlock';

const { Cell } = ResponsiveGrid;

const VoteNotStarted = () => (
  <ResponsiveGrid gap={20}>
    <Cell colSpan={12}>
      <VoteNotStartedBlock />
    </Cell>
  </ResponsiveGrid>
);

export default VoteNotStarted;
