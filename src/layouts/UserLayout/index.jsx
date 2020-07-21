import React from 'react';
import { Grid } from '@alifd/next';
import styles from './index.module.scss';

const { Row, Col } = Grid;

export default function UserLayout({ children }) {
  return (
    <div role="grid">
      <Row className={styles.container}>
        <Col span="12" className={styles.left} hidden={['xxs', 'xs', 's']}>
          {/* <div className={styles.left}> */}
          <img
            className={styles.loginpic}
            src="public/loginpic.svg"
            alt="loginpic"
          />
          {/* </div> */}
        </Col>
        <Col m={12} s={24}>
          {children}
        </Col>
      </Row>
    </div>
  );
}
