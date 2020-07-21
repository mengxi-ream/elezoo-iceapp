import React from 'react';
import { ResponsiveGrid } from '@alifd/next';
import RegisterBlock from './components/RegisterBlock';

const { Cell } = ResponsiveGrid;

const Register = () => (
  <ResponsiveGrid gap={20}>
    <Cell colSpan={12}>
      <RegisterBlock />
    </Cell>
  </ResponsiveGrid>
);

export default Register;
