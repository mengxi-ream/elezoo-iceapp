import React from 'react';
import { ResponsiveGrid } from '@alifd/next';
import QuickCreateBlock from './components/QuickCreateBlock';

const { Cell } = ResponsiveGrid;

const QuickCreate = () => (
  <ResponsiveGrid gap={20}>
    <Cell colSpan={12}>
      <QuickCreateBlock />
    </Cell>
  </ResponsiveGrid>
);

export default QuickCreate;
