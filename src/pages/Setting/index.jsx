import React from 'react';
import { ResponsiveGrid } from '@alifd/next';
import SettingBlock from './components/SettingBlock';

const { Cell } = ResponsiveGrid;

const Setting = () => (
  <ResponsiveGrid gap={20}>
    <Cell colSpan={12}>
      <SettingBlock />
    </Cell>
  </ResponsiveGrid>
);

export default Setting;
