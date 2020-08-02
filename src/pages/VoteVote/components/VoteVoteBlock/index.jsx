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
  Animate,
  Dialog,
} from '@alifd/next';
import UserAvatar from '@/components/UserAvatar';
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
  // get device
  const getDevice = (width) => {
    const isPhone =
      typeof navigator !== 'undefined' &&
      navigator &&
      navigator.userAgent.match(/phone/gi);

    if (width < 660 || isPhone) {
      return 'phone';
    }
    if (width < 1280 && width > 660) {
      return 'tablet';
    }
    return 'desktop';
  };

  const { id } = useParams();
  const history = useHistory();
  const [device, setDevice] = useState(getDevice(NaN));
  const [proposalIds, setProposalIds] = useState([]);
  const [proposalIdxs, setProposalIdxs] = useState([]);
  const [showName, setShowName] = useState([]);
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
        // history.push(`/vote/voting/${id}`);
        // await voteDispatchers.updatePeriod('end');
        await voteDetailService.getVote(id);
        history.push(`/vote/voting/${id}`);
        history.go();
        Message.success('成功结束投票');
      },
      onError: (err) => {
        err.response
          ? Message.error(err.response.data.message)
          : Message.error('结束投票失败');
      },
    }
  );

  const { loading: voteLoading, request: voteRequest } = useRequest(
    voteDetailService.vote,
    {
      onSuccess: async (result) => {
        console.log(result);
        await voteDispatchers.addSupporter(result);
        history.push(`/vote/end/${id}`);
        Message.success('投票成功');
      },
      onError: (err) => {
        err.response
          ? Message.error(err.response.data.message)
          : Message.error('投票失败');
      },
    }
  );

  useEffect(() => {
    request(id);
  }, []);

  // get device
  if (typeof window !== 'undefined') {
    window.addEventListener('optimizedResize', (e) => {
      const deviceWidth = (e && e.target && e.target.innerWidth) || NaN;
      setDevice(getDevice(deviceWidth));
    });
  }

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

  const popupConfirm = () => {
    Dialog.confirm({
      title: '确认',
      content: '你确定要结束投票吗？',
      onOk: () => {
        nextRequest(id, 'end');
      },
      // onCancel: () => console.log('cancel'),
    });
  };

  const handleNameShow = (_id) => {
    setShowName({ ...showName, [_id]: true });
  };

  const handleNameHide = (_id) => {
    setShowName({ ...showName, [_id]: false });
  };

  const SubBlock = () => {
    return (
      <div>
        {voteState.proposals.map((proposal) => {
          return (
            <div key={proposal.idx}>
              <div className={styles.itemBlock}>
                <div className={styles.index}>
                  {voteState.hasVoted || voteState.period === 'end' ? (
                    <div style={{ fontSize: 16 }}>{proposal.idx}.</div>
                  ) : voteState.multiChoice ? (
                    <Checkbox id={proposal._id} value={proposal.idx} />
                  ) : (
                    <Radio id={proposal._id} value={proposal.idx} />
                  )}
                </div>
                <div className={styles.blockRight}>
                  <div className={styles.item}>
                    <div className={styles.itemLeft}>
                      <div className={styles.content}>{proposal.content}</div>
                    </div>
                    <div className={styles.itemRight}>
                      <div>{proposal.subtotalVotes} 票</div>
                      {device !== 'phone' ? (
                        <div className={styles.percent}>
                          {Number(proposal.percent * 100).toFixed(0)}%
                        </div>
                      ) : null}
                      {voteState.showProposer ? (
                        <UserAvatar
                          src={
                            proposal.proposerInfo
                              ? proposal.proposerInfo.avatar
                              : '/public/icon/anonymously.png'
                          }
                          className={styles.proposer}
                          size="small"
                          userName={
                            proposal.proposerInfo &&
                            proposal.proposerInfo.userName
                          }
                        />
                      ) : null}
                    </div>
                  </div>
                  {proposal.subtotalVotes > 0 ? (
                    <div className={styles.avatarGroup}>
                      {proposal.votes.map((vote) => {
                        return (
                          <div key={vote._id} className={styles.supporter}>
                            <UserAvatar
                              size="small"
                              className={styles.supporterAvatar}
                              src={
                                vote.supporterInfo
                                  ? vote.supporterInfo.avatar
                                  : '/public/icon/anonymously.png'
                              }
                              userName={
                                vote.supporterInfo &&
                                vote.supporterInfo.userName
                              }
                            />
                            {showName[proposal._id] ? (
                              <div className={styles.supporterName}>
                                {vote.supporterInfo
                                  ? vote.supporterInfo.userName
                                  : ''}
                              </div>
                            ) : null}
                          </div>
                        );
                      })}{' '}
                      {showName[proposal._id] ? (
                        <Avatar
                          size="small"
                          src={'public/icon/less.svg'}
                          onClick={() => handleNameHide(proposal._id)}
                        />
                      ) : (
                        <Avatar
                          size="small"
                          src={'public/icon/more.svg'}
                          onClick={() => handleNameShow(proposal._id)}
                        />
                      )}
                    </div>
                  ) : (
                    ''
                  )}
                </div>
              </div>
              <div className={styles.dataBarBG}>
                <div
                  className={styles.dataBar}
                  style={{
                    height: 1,
                    width: `${proposal.percent * 100}%`,
                  }}
                />
              </div>
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
          <VoteInfo />
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
            {voteState.hasVoted ||
            voteState.period === 'end' ? null : voteState.privacyOption ===
              'free' ? (
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
            {voteState.owner &&
            voteState.owner === userState._id &&
            voteState.period !== 'end' ? (
              <Button
                warning
                type="normal"
                loading={nextLoading}
                style={{ display: 'block', margin: '0 auto' }}
                onClick={popupConfirm}
              >
                结束投票
              </Button>
            ) : null}
          </div>
        </Loading>
      </Card.Content>
    </Card>
  );
};

export default VoteVoteBlock;
