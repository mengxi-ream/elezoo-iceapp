import React, { useState, useEffect } from 'react';
import { useRequest, useParams, store, useHistory } from 'ice';
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
  MenuButton,
} from '@alifd/next';
import VoteInfo from '@/components/VoteInfo';
import voteDetailService from '@/services/voteDetail';
import SubmitButton from '@/components/SubmitBtn';
import styles from './index.module.scss';
import vote from '@/pages/Vote/services/vote';
import GreenBtn from '@/components/GreenBtn';

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

const VoteNotStartedBlock = () => {
  const { id } = useParams();
  const history = useHistory();
  const [newProposal, setProposal] = useState('');
  const [userState, userDispatchers] = store.useModel('user');
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

  const { loading: nextLoading, request: nextRequest } = useRequest(
    voteDetailService.nextPeriod,
    {
      onSuccess: async (result) => {
        console.log(result);
        history.push(`/vote/propose/${id}`);
        Message.success('成功进入提议');
      },
      onError: (err) => {
        err.response
          ? Message.error(err.response.data.message)
          : Message.error('进入提议失败');
      },
    }
  );

  useEffect(() => {
    request(id);
  }, []);

  return (
    <Card free>
      <Card.Content className={styles.votePageBlock}>
        <Loading visible={loading}>
          <VoteInfo voteState={voteState} />
          {voteState.owner && voteState.owner === userState._id ? (
            <div>
              <div className={styles.middleBlock} />
              <GreenBtn
                type="primary"
                loading={nextLoading}
                style={{ display: 'block', margin: '0 auto' }}
                onClick={() => {
                  nextRequest(id);
                }}
              >
                开始提议
              </GreenBtn>
            </div>
          ) : (
            ''
          )}
        </Loading>
      </Card.Content>
    </Card>
  );
};

export default VoteNotStartedBlock;
