import React from 'react';
import { ResponsiveGrid } from '@alifd/next';
import ForgetBlock from './components/ForgetBlock';

const { Cell } = ResponsiveGrid;

const Forget = () => (
  <ResponsiveGrid gap={20}>
    <Cell colSpan={12}>
      <ForgetBlock />
    </Cell>
  </ResponsiveGrid>
);

export default Forget;
