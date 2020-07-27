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
} from '@alifd/next';
import PageTab from '@/components/PageTab';
import SubmitBtn from '@/components/SubmitBtn';
import voteService from '@/pages/Vote/services/vote';
import styles from './index.module.scss';
import vote from '@/pages/Vote/services/vote';

const { Cell } = ResponsiveGrid;

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
                    src="https://i0.wp.com/img.fsbus.com/wp-content/uploads/2017/01/135333C5b.jpg?w=1440"
                  />
                </Card.Media>
                <div className={styles.cardMain}>
                  <Card.Header
                    title="Simple Card"
                    extra={
                      <Icon
                        type="upload"
                        size="small"
                        onClick={() => {
                          console.log('click icon');
                        }}
                        style={{ zIndex: 3 }}
                      />
                    }
                  />
                  <Card.Content>
                    <div>
                      Lorem ipsum dolor sit amet, est viderer iuvaret perfecto
                      et. Ne petentium quaerendum nec, eos ex recteque
                      mediocritatem, ex usu assum legendos temporibus. Ius
                      feugiat pertinacia an, cu verterem praesent quo.
                    </div>
                    <div>Casper Rudd</div>
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
