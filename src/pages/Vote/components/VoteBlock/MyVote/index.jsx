import React, { useEffect } from 'react';
import { useRequest } from 'ice';
import { store as pageStore } from 'ice/Vote';
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
  Icon,
  Tag,
} from '@alifd/next';
import PageTab from '@/components/PageTab';
import SubmitBtn from '@/components/SubmitBtn';
import voteService from '@/pages/Vote/services/vote';
import styles from './index.module.scss';
import vote from '@/pages/Vote/services/vote';

const { Cell } = ResponsiveGrid;
const periods = {
  notStarted: { label: '未开始', color: 'blue' },
  proposing: { label: '提议中', color: 'green' },
  voting: { label: '投票中', color: 'orange' },
  end: { label: '已结束', color: '#E2E4E8' },
};

const MyVote = () => {
  const [voteState, voteDispatchers] = pageStore.useModel('vote');
  const { data, loading, request } = useRequest(voteService.getVotes, {
    onSuccess: async (result) => {
      console.log(result);
      await voteDispatchers.fetchVotes(result);
      // Message.success('加载成功');
    },
    onError: (err) => {
      err.response.data
        ? Message.error(err.response.data.message)
        : Message.error('加载失败');
    },
  });

  useEffect(() => {
    request();
  }, [voteState.fetchTrigger]);

  return (
    <Card free>
      <Card.Content className={styles.pageBlock}>
        <Loading visible={loading}>
          {voteState.items.map((item) => {
            return (
              <Card
                className={styles.card}
                free
                key={item._id}
                onClick={() => {
                  console.log('click card');
                }}
              >
                <Card.Media className={styles.cardMedia}>
                  <img
                    className={styles.cardMedia}
                    src={item.cover ? item.cover : 'public/logo/defaultBG.png'}
                  />
                </Card.Media>
                <div className={styles.cardMain}>
                  <Card.Header
                    title={item.title}
                    extra={
                      <Icon
                        type="upload"
                        size="small"
                        role="button"
                        aria-label="icon share"
                        onClick={(e) => {
                          console.log('click icon');
                          // 首先 icon 的 z-index 本身就比 card 高
                          // 我们先触发 icon 的 onclick 之后直接 stopPropagation 就可以防止触发 card 的 onclick
                          e.stopPropagation();
                        }}
                      />
                    }
                  />
                  <Card.Content>
                    <div className={styles.tag}>
                      <Tag type="primary" color="blue" size="small">
                        未开始
                      </Tag>
                      {item.pricacyOption === 'anonymity' ? (
                        <img
                          src="public/icon/anonymously.png"
                          className={styles.privacyOption}
                        />
                      ) : (
                        <Avatar
                          className={styles.privacyOption}
                          src={item.ownerAvatar}
                        />
                      )}
                    </div>
                    <div className={styles.detail}>{item.detail}</div>
                    <div className={styles.time}>
                      <div className={styles.timeItem}>
                        <span className={styles.timeUnder}>提议截止</span>：
                        {item.voteStart ? item.voteStart.slice(0, 10) : '待定'}
                      </div>{' '}
                      <div className={styles.timeItem}>
                        <span className={styles.timeUnder}>投票截止</span>：
                        {item.voteEnd ? item.voteEnd.slice(0, 10) : '待定'}
                      </div>
                    </div>
                  </Card.Content>
                </div>
              </Card>
            );
          })}
        </Loading>
      </Card.Content>
    </Card>
  );
};

export default MyVote;
