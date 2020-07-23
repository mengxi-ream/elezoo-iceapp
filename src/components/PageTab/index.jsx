import React from 'react';
import { Tab } from '@alifd/next';
import styles from './index.module.scss';

const PageTab = (props) => {
  return (
    <Tab
      {...props}
      className={`${styles.customTab} ${props.ClassName}`}
      navClassName={`${styles.customTabHead} ${props.navClassName}`}
    >
      {props.children}
    </Tab>
  );
};

export default PageTab;
