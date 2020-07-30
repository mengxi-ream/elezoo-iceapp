import React, { useState } from 'react';
import { useRequest, store } from 'ice';
import {
  Button,
  Card,
  Form,
  ResponsiveGrid,
  Avatar,
  Upload,
  Divider,
  Input,
  Message,
} from '@alifd/next';
import PageTab from '@/components/PageTab';
import SubmitBtn from '@/components/SubmitBtn';
import userService from '@/services/user';
import styles from './index.module.scss';

const { Cell } = ResponsiveGrid;

const JoinVote = () => {
  return (
    <Card free>
      <Card.Content className={styles.settingPageBlock}></Card.Content>
    </Card>
  );
};

export default JoinVote;
