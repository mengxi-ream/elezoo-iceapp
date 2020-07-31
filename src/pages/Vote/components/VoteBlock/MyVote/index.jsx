import React, { useEffect, useState } from 'react';
import { useRequest, useHistory, store } from 'ice';
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
  Box,
} from '@alifd/next';
import PageTab from '@/components/PageTab';
import SubmitBtn from '@/components/SubmitBtn';
import voteService from '@/pages/Vote/services/vote';
import DynamicIcon from '@icedesign/dynamic-icon';
import styles from './index.module.scss';

const CustomIcon = DynamicIcon.create({
  fontFamily: 'iconfont',
  prefix: 'icon',
  css: 'https://at.alicdn.com/t/font_1969578_z8tm4vu9r6f.css',
});

const { Cell } = ResponsiveGrid;
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

const MyVote = () => {
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

  const history = useHistory();
  const [voteState, voteDispatchers] = pageStore.useModel('vote');
  const [userState, userDispathers] = store.useModel('user');
  const [device, setDevice] = useState(getDevice(NaN));
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

  // get device
  if (typeof window !== 'undefined') {
    window.addEventListener('optimizedResize', (e) => {
      const deviceWidth = (e && e.target && e.target.innerWidth) || NaN;
      setDevice(getDevice(deviceWidth));
    });
  }

  return (
    <Card free>
      <Card.Content className={styles.pageBlock}>
        <Loading visible={loading}>
          {!loading && voteState.items.length === 0 ? (
            <Card
              free
              className={styles.card}
              onClick={() => {
                history.push(`/quick`);
                console.log('click card');
              }}
            >
              <Card.Media className={styles.cardMedia}>
                <img
                  className={styles.cardMedia}
                  src="public/logo/defaultBG.png"
                />
              </Card.Media>
              <Box className={styles.add} justify="center" align="center">
                <Icon type="add" size="xl" className={styles.addIcon} />
                点击添加投票
              </Box>
            </Card>
          ) : (
            <div>
              {voteState.items.map((item) => {
                return (
                  <Card
                    className={styles.card}
                    free
                    key={item._id}
                    onClick={() => {
                      history.push(`/vote/${item.period}/${item._id}`);
                      console.log('click card');
                    }}
                  >
                    <Card.Media className={styles.cardMedia}>
                      <img
                        className={styles.cardMedia}
                        src={
                          item.cover ? item.cover : 'public/logo/defaultBG.png'
                        }
                      />
                    </Card.Media>
                    <div className={styles.cardMain}>
                      <Card.Header
                        title={item.title}
                        extra={
                          item.owner === userState._id ? (
                            <CustomIcon
                              className={styles.iconButton}
                              type="share2"
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
                          ) : null
                        }
                      />
                      <Card.Content>
                        <div className={styles.tag}>
                          <Tag
                            type="primary"
                            color={periodColors[item.period]}
                            size="small"
                          >
                            {periodLabels[item.period]}
                          </Tag>
                          <Avatar
                            className={styles.privacyOption}
                            src={
                              item.ownerInfo
                                ? item.ownerInfo.avatar
                                : 'public/icon/anonymously.png'
                            }
                          />
                        </div>
                        <div className={styles.detail}>{item.detail}</div>
                        <div className={styles.time}>
                          <div className={styles.timeItem}>
                            <span className={styles.timeUnder}>提议截止</span>：
                            {item.voteStart
                              ? device === 'phone'
                                ? item.voteStart.slice(5, 10)
                                : item.voteStart.slice(0, 10)
                              : '待定'}
                          </div>{' '}
                          <div className={styles.timeItem}>
                            <span className={styles.timeUnder}>投票截止</span>：
                            {item.voteEnd
                              ? device === 'phone'
                                ? item.voteEnd.slice(5, 10)
                                : item.voteEnd.slice(0, 10)
                              : '待定'}
                          </div>
                        </div>
                      </Card.Content>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </Loading>
      </Card.Content>
    </Card>
  );
};

export default MyVote;
