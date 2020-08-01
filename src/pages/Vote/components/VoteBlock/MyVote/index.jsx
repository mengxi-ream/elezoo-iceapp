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
  Input,
  Message,
  Loading,
  Icon,
  Tag,
  Box,
  Dropdown,
  Menu,
  Pagination,
} from '@alifd/next';
import PageTab from '@/components/PageTab';
import SubmitBtn from '@/components/SubmitBtn';
import VoteCard from '@/components/VoteCard';
import voteService from '@/pages/Vote/services/vote';
import DynamicIcon from '@icedesign/dynamic-icon';
import styles from './index.module.scss';

const CustomIcon = DynamicIcon.create({
  fontFamily: 'iconfont',
  prefix: 'icon',
  css: 'https://at.alicdn.com/t/font_1969578_v7k955ft6b9.css',
});

const { Cell } = ResponsiveGrid;
const { Item, Group, Divider, CheckboxItem, RadioItem } = Menu;
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
const roleItems = [
  { label: '我发起', name: 'owner' },
  { label: '他人发起', name: 'notOwner' },
];
const periodItems = [
  { label: '未开始', name: 'notStarted' },
  { label: '提议中', name: 'proposing' },
  { label: '投票中', name: 'voting' },
  { label: '已结束', name: 'end' },
];
const privacyItems = [
  { label: '实名', name: 'realName' },
  { label: '自由', name: 'free' },
  { label: '匿名', name: 'anonymity' },
];

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
    title: 0,
    createAt: -1,
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
    request({
      ...selectData,
      current: voteState.current,
      pageSize: voteState.pageSize,
    });
  }, [voteState.fetchTrigger]);

  // get device
  if (typeof window !== 'undefined') {
    window.addEventListener('optimizedResize', (e) => {
      const deviceWidth = (e && e.target && e.target.innerWidth) || NaN;
      setDevice(getDevice(deviceWidth));
    });
  }

  const handleFilterChange = (field) => {
    setSelectData({ ...selectData, [field]: !selectData[field] });
  };

  const handleSelectChange = (field, value) => {
    const origin = { title: 0, createAt: 0 };
    setSelectData({ ...selectData, ...origin, [field]: value });
  };

  const onSelectChange = (visible) => {
    if (!visible) {
      voteDispatchers.updateCurrent(1);
      request({ ...selectData, current: 1, pageSize: voteState.pageSize });
    }
  };

  const handleCurrentChange = (current) => {
    voteDispatchers.updateCurrent(current);
    request({
      ...selectData,
      current: current,
      pageSize: voteState.pageSize,
    });
  };

  const FliterMenu = () => {
    return (
      <Menu>
        <Group label="发起人">
          {roleItems.map(({ label, name }) => (
            <CheckboxItem
              key={name}
              checked={selectData[name]}
              onChange={() => handleFilterChange(name)}
            >
              {label}
            </CheckboxItem>
          ))}
        </Group>
        <Divider />
        <Group label="进程">
          {periodItems.map(({ label, name }) => (
            <CheckboxItem
              key={name}
              checked={selectData[name]}
              onChange={() => handleFilterChange(name)}
            >
              {label}
            </CheckboxItem>
          ))}
        </Group>
        <Divider />
        <Group label="匿名方式">
          {privacyItems.map(({ label, name }) => (
            <CheckboxItem
              key={name}
              checked={selectData[name]}
              onChange={() => handleFilterChange(name)}
            >
              {label}
            </CheckboxItem>
          ))}
        </Group>
      </Menu>
    );
  };

  const SortMenu = () => {
    return (
      <Menu>
        <Group label="降序">
          <RadioItem
            checked={selectData.createAt === -1}
            onChange={() => handleSelectChange('createAt', -1)}
          >
            创建时间
          </RadioItem>
          <RadioItem
            checked={selectData.title === -1}
            onChange={() => handleSelectChange('title', -1)}
          >
            投票名称
          </RadioItem>
        </Group>
        <Divider />
        <Group label="升序">
          <RadioItem
            checked={selectData.createAt === 1}
            onChange={() => handleSelectChange('createAt', 1)}
          >
            创建时间
          </RadioItem>
          <RadioItem
            checked={selectData.title === 1}
            onChange={() => handleSelectChange('title', 1)}
          >
            投票名称
          </RadioItem>
        </Group>
      </Menu>
    );
  };

  return (
    <Card free>
      <Card.Content className={styles.pageBlock}>
        <div className={styles.hellowContainer}>
          <div className={styles.hellowLeft}>
            <Avatar
              size="large"
              src={'public/icon/cat.svg'}
              style={{ marginRight: 8 }}
            />
            <div>Hi, 今天过的怎么样?</div>
          </div>
          <div className={styles.hellowRight}>
            <Dropdown
              trigger={<Icon type="sorting" className={styles.hellowButton} />}
              triggerType="click"
              align="tr br"
              onVisibleChange={onSelectChange}
            >
              <SortMenu />
            </Dropdown>
            <Dropdown
              trigger={<Icon type="filter" className={styles.hellowButton} />}
              triggerType="click"
              align="tr br"
              onVisibleChange={onSelectChange}
            >
              <FliterMenu />
            </Dropdown>
          </div>
        </div>
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

export default MyVote;
