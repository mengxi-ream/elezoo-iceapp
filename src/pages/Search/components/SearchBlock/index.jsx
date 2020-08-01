import React, { useEffect, useState } from 'react';
import { useRequest, useHistory, store, useSearchParams } from 'ice';
import { store as pageStore } from 'ice/Search';
import {
  Button,
  Card,
  Form,
  ResponsiveGrid,
  Avatar,
  Upload,
  Input,
  Message,
  Loading,
  Icon,
  Tag,
  Box,
  Pagination,
} from '@alifd/next';
import PageTab from '@/components/PageTab';
import SubmitBtn from '@/components/SubmitBtn';
import VoteCard from '@/components/VoteCard';
import voteService from '@/pages/Search/services/vote';
import DynamicIcon from '@icedesign/dynamic-icon';
import styles from './index.module.scss';

const CustomIcon = DynamicIcon.create({
  fontFamily: 'iconfont',
  prefix: 'icon',
  css: 'https://at.alicdn.com/t/font_1969578_v7k955ft6b9.css',
});

const { Cell } = ResponsiveGrid;

const SearchBlock = () => {
  const history = useHistory();
  const { content } = useSearchParams();
  const [voteState, voteDispatchers] = pageStore.useModel('vote');
  const [userState, userDispathers] = store.useModel('user');
  const [selectData, setSelectData] = useState({
    owner: true,
    notOwner: true,
    notStarted: true,
    proposing: true,
    voting: true,
    end: true,
    realName: true,
    free: true,
    anonymity: true,
  });
  const { data, loading, request } = useRequest(voteService.getVotes, {
    onSuccess: async (result) => {
      console.log(result);
      await voteDispatchers.fetchVotes(result.items);
      await voteDispatchers.fetchTotal(result.total);
      // Message.success('加载成功');
    },
    onError: (err) => {
      err.response.data
        ? Message.error(err.response.data.message)
        : Message.error('加载失败');
    },
  });

  useEffect(() => {
    console.log(content);
    request({
      ...selectData,
      current: voteState.current,
      pageSize: voteState.pageSize,
      searchContent: content,
    });
  }, [voteState.fetchTrigger]);

  const handleCurrentChange = (current) => {
    voteDispatchers.updateCurrent(current);
    request({
      ...selectData,
      current: current,
      pageSize: voteState.pageSize,
      searchContent: content,
    });
  };

  return (
    <Card free>
      <Card.Content className={styles.pageBlock}>
        <Loading visible={loading}>
          {!loading && voteState.items.length === 0 ? (
            <div style={{ textAlign: 'center' }}>抱歉！没有你要找的投票。</div>
          ) : (
            <div>
              {voteState.items.map((item) => {
                return <VoteCard key={item._id} item={item} />;
              })}
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Pagination
              type="simple"
              current={voteState.current}
              pageSize={voteState.pageSize}
              total={voteState.total}
              hideOnlyOnePage={true}
              style={{ marginTop: 32 }}
              onChange={handleCurrentChange}
            />
          </div>
        </Loading>
      </Card.Content>
    </Card>
  );
};

export default SearchBlock;
