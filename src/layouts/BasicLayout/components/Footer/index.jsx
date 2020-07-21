import React from 'react';
import styles from './index.module.scss';

export default function Footer() {
  return (
    <p className={styles.footer}>
      <span className={styles.logo}>Elezoo</span>
      <br />
      <span className={styles.copyright}>
        © 2020-Now Created By Kuiliang Zhang
      </span>
    </p>
  );
}
