import React from 'react';
import { ResponsiveGrid } from '@alifd/next';
import ResetBlock from './components/ResetBlock';

const { Cell } = ResponsiveGrid;

const Reset = () => (
  <ResponsiveGrid gap={20}>
    <Cell colSpan={12}>
      <ResetBlock />
    </Cell>
  </ResponsiveGrid>
);

export default Reset;
