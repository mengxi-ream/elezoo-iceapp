import React from 'react';
import { ResponsiveGrid } from '@alifd/next';
import UpdateVoteBlock from './components/UpdateVoteBlock';

const { Cell } = ResponsiveGrid;

const UpdateVote = () => (
  <ResponsiveGrid gap={20}>
    <Cell colSpan={12}>
      <UpdateVoteBlock />
    </Cell>
  </ResponsiveGrid>
);

export default UpdateVote;
