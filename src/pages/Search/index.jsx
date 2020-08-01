import React from 'react';
import { ResponsiveGrid } from '@alifd/next';
import SearchBlock from './components/SearchBlock';

const { Cell } = ResponsiveGrid;

const Search = () => (
  <ResponsiveGrid gap={20}>
    <Cell colSpan={12}>
      <SearchBlock />
    </Cell>
  </ResponsiveGrid>
);

export default Search;
