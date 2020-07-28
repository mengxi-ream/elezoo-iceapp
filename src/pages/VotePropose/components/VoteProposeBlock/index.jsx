import React, { useState, useEffect } from 'react';
import { useRequest, useParams, store } from 'ice';
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
  Loading,
  Tag,
  Icon,
  Grid,
} from '@alifd/next';
import VoteInfo from '@/components/VoteInfo';
import voteDetailService from '@/services/voteDetail';
import styles from './index.module.scss';

const { Cell } = ResponsiveGrid;
const { Row, Col } = Grid;
const periodLabels = {
  notStarted: '未开始',
  proposing: '提议中',
  voting: '投票中',
  end: '已结束',
};
const periodColors = {
  notStarted: 'blue',
  proposing: 'green',
  voting: 'orange',
  end: '#E2E4E8',
};
const privacyLabels = {
  realName: '实名',
  free: '自由',
  anonymity: '匿名',
};

const VoteProposeBlock = () => {
  const { id } = useParams();
  const [voteState, voteDispatchers] = store.useModel('voteDetail');
  const { data, loading, request } = useRequest(voteDetailService.getVote, {
    onSuccess: async (result) => {
      console.log(result);
      await voteDispatchers.fetchVote(result);
      // Message.success('加载成功');
    },
    onError: () => {
      Message.error('加载失败');
    },
  });

  useEffect(() => {
    request(id);
  }, []);

  return (
    <Card free>
      <Card.Content className={styles.votePageBlock}>
        <Loading visible={loading}>
          <VoteInfo voteState={voteState} />
        </Loading>
      </Card.Content>
    </Card>
  );
};

export default VoteProposeBlock;
