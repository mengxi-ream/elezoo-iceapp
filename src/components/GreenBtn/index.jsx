import React, { useState } from 'react';
import { Button } from '@alifd/next';
import styles from './index.module.scss';

const GreenBtn = (props) => {
  return (
    <Button {...props} className={`${styles.btn} ${props.className}`}>
      {props.children}
    </Button>
  );
};

export default GreenBtn;
