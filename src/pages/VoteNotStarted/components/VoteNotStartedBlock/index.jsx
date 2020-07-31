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
      if (result.period !== 'notStarted')
        history.push(`/vote/${result.period}/${result._id}`);
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
        history.push(`/vote/proposing/${id}`);
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
          <VoteInfo/>
          {voteState.owner && voteState.owner === userState._id ? (
            <div>
              <div className={styles.middleBlock} />
              🎉恭喜您在<span className={styles.elezoo}> Elezoo </span>
              成功创建了一个提议性投票，🥳投票的参与者可以对投票选项进行提议，并且这里有丰富的隐私设置供您选择。请点击下面的按钮开始提议。
              <div className={styles.middleBlock} />
              <Button
                type="secondary"
                loading={nextLoading}
                style={{ display: 'block', margin: '0 auto' }}
                onClick={() => {
                  nextRequest(id, 'proposing');
                }}
              >
                开始提议
              </Button>
            </div>
          ) : (
            <div>
              <div className={styles.middleBlock} />
              🎉恭喜您在<span className={styles.elezoo}> Elezoo </span>
              成功加入了一个提议性投票，🥳投票的参与者可以对投票选项进行提议，并且这里有丰富的隐私设置供您选择。请等待投票发起人邀请您进入提议环节。
            </div>
          )}
        </Loading>
      </Card.Content>
    </Card>
  );
};

export default VoteNotStartedBlock;
