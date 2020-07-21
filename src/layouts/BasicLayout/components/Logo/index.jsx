import React from 'react';
import { Link } from 'ice';
import styles from './index.module.scss';

export default function Logo({ image, text, url }) {
  return (
    <div className="logo">
      <Link to={url || '/user/login'} className={styles.logo}>
        {image && <img src={image} alt="logo" />}
        <span className={styles.name}>{text}</span>
      </Link>
    </div>
  );
}