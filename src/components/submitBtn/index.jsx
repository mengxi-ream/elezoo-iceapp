import React, { useState } from 'react';
import { Form } from '@alifd/next';
import styles from './index.module.scss';

const SubmitBtn = (props) => {
  return (
    <Form.Submit {...props} className={`${styles.btn} ${props.className}`}>
      {props.children}
    </Form.Submit>
  );
};

export default SubmitBtn;
