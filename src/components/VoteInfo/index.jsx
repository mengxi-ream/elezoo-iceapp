import React, { useState, useEffect } from 'react';
import { useRequest, useParams, store, useHistory } from 'ice';
import {
  Avatar,
  Icon,
  Grid,
  Tag,
  Drawer,
  Input,
  Button,
  Form,
  Switch,
  Message,
  Dialog,
  List,
} from '@alifd/next';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import voteDetailService from '@/services/voteDetail';
import DynamicIcon from '@icedesign/dynamic-icon';
import styles from './index.module.scss';
import moment from 'moment';

const CustomIcon = DynamicIcon.create({
  fontFamily: 'iconfont',
  prefix: 'icon',
  css: 'https://at.alicdn.com/t/font_1969578_z8tm4vu9r6f.css',
});

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

const VoteInfo = (props) => {
  const { id } = useParams();
  const history = useHistory();
  const [userState, userDispatchers] = store.useModel('user');
  const [voteState, voteDispatchers] = store.useModel('voteDetail');
  const [visibleDrawer, setVisibleDrawer] = useState(false);

  const { data, loading, request } = useRequest(
    voteDetailService.resetShareId,
    {
      onSuccess: async (result) => {
        await voteDispatchers.updatePart({ share: result.share });
        Message.success('重置成功');
      },
      onError: () => {
        Message.error('重置失败');
      },
    }
  );

  const {
    data: activeData,
    loading: activeLoading,
    request: activeRequest,
  } = useRequest(voteDetailService.shareActive, {
    onSuccess: async (result) => {
      await voteDispatchers.updatePart({ share: result.share });
    },
  });

  const { request: leaveRequest } = useRequest(voteDetailService.leave, {
    onSuccess: () => {
      Message.success('离开投票成功');
      history.push('/');
    },
    onError: () => {
      Message.error('离开投票失败');
    },
  });

  const { request: destroyRequest } = useRequest(voteDetailService.destroy, {
    onSuccess: () => {
      Message.success('删除投票成功');
      history.push('/');
    },
    onError: () => {
      Message.error('删除投票失败');
    },
  });

  const onSettingClick = () => {
    history.push(`/vote/update/${id}`);
    // console.log(id);
  };

  const leaveConfirm = () => {
    Dialog.confirm({
      title: '确认',
      content: '你确定要离开投票吗？',
      onOk: () => {
        leaveRequest(id);
      },
    });
  };

  const destroyConfirm = () => {
    Dialog.confirm({
      title: '确认',
      content: '你确定要删除投票吗？',
      onOk: () => {
        destroyRequest(id);
      },
    });
  };

  const resetConfirm = () => {
    Dialog.confirm({
      title: '确认',
      content: '重置链接将导致之前的链接失效',
      onOk: () => {
        request(id);
      },
      // onCancel: () => console.log('cancel'),
    });
  };

  return (
    <div>
      <div className={styles.tools}>
        <Tag type="primary" color={periodColors[voteState.period]}>
          {periodLabels[voteState.period]}
        </Tag>
        <div
          style={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}
        >
          {userState._id !== voteState.owner ? (
            <Icon
              className={styles.iconButton}
              type="exit"
              role="button"
              aria-label="icon exit"
              onClick={leaveConfirm}
            />
          ) : null}
          {userState._id === voteState.owner ? (
            <Icon
              className={styles.iconButton}
              type="ashbin"
              role="button"
              aria-label="icon ashbin"
              onClick={destroyConfirm}
            />
          ) : null}
          {userState._id === voteState.owner ? (
            <Icon
              className={styles.iconButton}
              type="set"
              role="button"
              aria-label="icon set"
              onClick={onSettingClick}
            />
          ) : null}
          {voteState.owner === userState._id ? (
            <CustomIcon
              className={styles.iconButton}
              style={{ marginTop: 2 }}
              type="share2"
              role="button"
              aria-label="icon share"
              onClick={() => {
                console.log('click icon');
                setVisibleDrawer(true);
              }}
            />
          ) : null}
        </div>
      </div>
      <div className={styles.title}>{voteState.title}</div>
      <div className={styles.detail}>{voteState.detail}</div>
      <div className={styles.infoContainer}>
        <Row className={styles.infoLine} wrap>
          <Col xxs={24} xs={12}>
            <span className={styles.under}>发起人</span>：
            <Avatar
              src={voteState.ownerInfo ? voteState.ownerInfo.avatar : undefined}
              size="small"
              style={{ marginRight: 8 }}
            />
            {voteState.ownerInfo ? voteState.ownerInfo.userName : undefined}
          </Col>
          <Col xxs={24} xs={12}>
            <span className={styles.under}>匿名方式</span>：
            {privacyLabels[voteState.privacyOption]}
          </Col>
        </Row>
        {/* <Row className={styles.infoLine} wrap>
          <Col xxs={24} xs={12}>
            <span className={styles.under}>选择方式</span>：
            {voteState.multiChoice ? '多选投票' : '单选投票'}
          </Col>
          <Col xxs={24} xs={12}>
            <span className={styles.under}>显示提议人</span>：
            {voteState.showProposer ? '显示' : '不显示'}
          </Col>
        </Row> */}
        <Row className={styles.infoLine} wrap>
          <Col xxs={24} xs={12}>
            <span className={styles.under}>提议开始</span>：
            {voteState.proposeStart
              ? moment(voteState.proposeStart).format('YYYY-MM-DD HH:mm')
              : '待定'}
          </Col>
          <Col xxs={24} xs={12}>
            <span className={styles.under}>提议结束</span>：
            {voteState.voteStart
              ? moment(voteState.voteStart).format('YYYY-MM-DD HH:mm')
              : '待定'}
          </Col>
        </Row>
        <Row className={styles.infoLine} wrap>
          <Col xxs={24} xs={12}>
            <span className={styles.under}>投票开始</span>：
            {voteState.voteStart
              ? moment(voteState.voteStart).format('YYYY-MM-DD HH:mm')
              : '待定'}
          </Col>
          <Col xxs={24} xs={12}>
            <span className={styles.under}>投票结束</span>：
            {voteState.voteEnd
              ? moment(voteState.voteEnd).format('YYYY-MM-DD HH:mm')
              : '待定'}
          </Col>
        </Row>
      </div>
      <Drawer
        className={styles.drawer}
        title="分享投票"
        placement="right"
        visible={visibleDrawer}
        closeable="mask,esc"
        onClose={() => {
          setVisibleDrawer(false);
        }}
        headerStyle={{ border: 0, marginTop: 8 }}
      >
        <div className={styles.drawerSubhead}>
          <div className={styles.drawerSubheadLeft}>
            <CustomIcon
              type="round_link_fill"
              size="xl"
              className={styles.linkIcon}
            />
            分享链接
          </div>
          <Switch
            checked={voteState.share && voteState.share.active}
            size="small"
            onClick={() => {
              activeRequest(id, { active: !voteState.share.active });
            }}
          />
        </div>
        {voteState.share && voteState.share.active ? (
          <div>
            <Form
              labelAlign="top"
              value={{
                link:
                  voteState.share &&
                  `http://localhost:3333/#/vote/share/${voteState._id}?uuid=${voteState.share.uuid}`,
              }}
            >
              <Form.Item>
                <Input
                  name="link"
                  placeholder="点击下方按钮生成链接"
                  addonAfter={
                    <CopyToClipboard
                      text={
                        voteState.share &&
                        `http://localhost:3333/#/vote/share/${voteState._id}?uuid=${voteState.share.uuid}`
                      }
                      onCopy={() => {
                        Message.success('复制成功');
                      }}
                    >
                      <Button>复制</Button>
                    </CopyToClipboard>
                  }
                />
              </Form.Item>
            </Form>
            <Button
              loading={loading}
              style={{ display: 'block', margin: '0 auto' }}
              onClick={resetConfirm}
            >
              重置分享链接
            </Button>
          </div>
        ) : null}
        <div className={styles.drawerSubhead}>
          <div className={styles.drawerSubheadLeft}>
            <CustomIcon
              type="person_circle_fill"
              size="xl"
              className={styles.memberIcon}
            />
            投票成员
          </div>
        </div>
        <List size="small" className={styles.memberList}>
          {voteState.votersInfo &&
            voteState.votersInfo.map((voter) => {
              return (
                <List.Item
                  key={voter._id}
                  extra={
                    voter._id === voteState.owner ? (
                      <div className={styles.status}>发起</div>
                    ) : (
                      <div className={styles.status}>参与</div>
                    )
                  }
                  title={voter.userName}
                  media={<Avatar src={voter.avatar} />}
                />
              );
            })}
        </List>
      </Drawer>
    </div>
  );
};

export default VoteInfo;
