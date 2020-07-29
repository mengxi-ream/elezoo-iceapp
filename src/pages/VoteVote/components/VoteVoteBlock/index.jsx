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
  Checkbox,
  Radio,
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

const VoteVoteBlock = () => {
  const { id } = useParams();
  const history = useHistory();
  const [proposalIds, setProposalIds] = useState([]);
  const [proposalIdxs, setProposalIdxs] = useState([]);
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
        history.push(`/vote/end/${id}`);
        Message.success('成功进入提议');
      },
      onError: (err) => {
        err.response
          ? Message.error(err.response.data.message)
          : Message.error('进入提议失败');
      },
    }
  );

  const { loading: voteLoading, request: voteRequest } = useRequest(
    voteDetailService.vote,
    {
      onSuccess: async (result) => {
        console.log(result);
        // history.push(`/vote/voting/${id}`);
        Message.success('成功');
      },
      onError: (err) => {
        err.response
          ? Message.error(err.response.data.message)
          : Message.error('失败');
      },
    }
  );

  useEffect(() => {
    request(id);
  }, []);

  const onCheckboxChange = (idxList) => {
    console.log('value', idxList);
    setProposalIdxs(idxList);
    const _ids = idxList.map((idx) => voteState.proposals[idx - 1]._id);
    setProposalIds(_ids);
  };

  const onRadioChange = (idx) => {
    console.log('value', idx);
    setProposalIdxs([idx]);
    const _ids = [voteState.proposals[idx - 1]._id];
    setProposalIds([_ids]);
  };

  const onSubmit = () => {
    console.log(voteState.privacyOption);
    if (proposalIds.length < 1) {
      Message.error('请选择投票');
      return;
    }
    voteRequest(
      id,
      {
        proposalIds,
        privacy: voteState.privacyOption,
      },
      voteState,
      proposalIdxs,
      userState
    );
  };

  const onItemSubmit = (privacyOption) => {
    console.log(privacyOption);
    if (proposalIds.length < 1) {
      Message.error('请选择投票');
      return;
    }
    voteRequest(
      id,
      {
        proposalIds,
        privacy: privacyOption,
      },
      voteState,
      proposalIdxs,
      userState
    );
  };

  const SubBlock = () => {
    return (
      <div>
        {voteState.proposals.map((proposal) => {
          return (
            <div key={proposal.idx}>
              <div className={styles.itemBlock}>
                <div className={styles.index}>
                  {voteState.multiChoice ? (
                    <Checkbox id={proposal.idx} value={proposal.idx} />
                  ) : (
                    <Radio id={proposal.idx} value={proposal.idx} />
                  )}
                </div>
                <div className={styles.blockRight}>
                  <div className={styles.item}>
                    <div className={styles.itemLeft}>
                      <div className={styles.content}>{proposal.content}</div>
                    </div>
                    <div className={styles.itemRight}>
                      <div>{proposal.subtotalVotes}票</div>
                      <div className={styles.percent}>40%</div>
                    </div>
                  </div>
                  {proposal.subtotalVotes > 0 ? (
                    <div className={styles.avatarGroup}>
                      {proposal.votes.map((vote) => {
                        return (
                          <Avatar
                            key={vote._id}
                            size="small"
                            className={styles.supporterAvatar}
                            src={
                              vote.supporterInfo
                                ? vote.supporterInfo.avatar
                                : '/public/icon/anonymously.png'
                            }
                          />
                        );
                      })}
                    </div>
                  ) : (
                    ''
                  )}
                </div>
              </div>
              <Divider className={styles.divider} />
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <Card free>
      <Card.Content className={styles.votePageBlock}>
        <Loading visible={loading}>
          <VoteInfo voteState={voteState} />
          <div className={styles.middleBlock} />
          {voteState.multiChoice ? (
            <Checkbox.Group
              style={{ width: '100%' }}
              onChange={onCheckboxChange}
            >
              <SubBlock />
            </Checkbox.Group>
          ) : (
            <Radio.Group style={{ width: '100%' }} onChange={onRadioChange}>
              <SubBlock />
            </Radio.Group>
          )}
          <div className={styles.middleBlock} />
          <div className={styles.btnGroup}>
            {voteState.privacyOption === 'free' ? (
              <MenuButton
                label="提交投票"
                type="primary"
                className={styles.btn}
                loading={voteLoading}
                onItemClick={onItemSubmit}
              >
                <MenuButton.Item key="realName">{'实名提交'}</MenuButton.Item>
                <MenuButton.Item key="anonymity">{'匿名提交'}</MenuButton.Item>
              </MenuButton>
            ) : (
              <Button
                type="primary"
                className={styles.btn}
                loading={voteLoading}
                onClick={onSubmit}
              >
                提交投票
              </Button>
            )}
            {voteState.owner && voteState.owner === userState._id ? (
              <Button
                warning
                type="normal"
                loading={nextLoading}
                style={{ display: 'block', margin: '0 auto' }}
                onClick={() => {
                  nextRequest(id, 'end');
                }}
              >
                结束投票
              </Button>
            ) : (
              ''
            )}
          </div>
        </Loading>
      </Card.Content>
    </Card>
  );
};

export default VoteVoteBlock;
