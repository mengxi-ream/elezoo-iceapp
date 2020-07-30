import React, { useState, useEffect } from 'react';
import { useRequest, useParams, store, useHistory } from 'ice';
import { Avatar, Icon, Grid, Tag } from '@alifd/next';
import voteDetailService from '@/services/voteDetail';
import DynamicIcon from '@icedesign/dynamic-icon';
import styles from './index.module.scss';
import moment from 'moment';

const CustomIcon = DynamicIcon.create({
  fontFamily: 'iconfont',
  prefix: 'icon',
  css: 'https://at.alicdn.com/t/font_1969578_5fz0k52q28e.css',
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
  const { voteState } = props;
  const [userState, userDispatchers] = store.useModel('user');

  const onSettingClick = () => {
    history.push(`/vote/update/${id}`);
    // console.log(id);
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
          <Icon
            className={styles.iconButton}
            type="ashbin"
            role="button"
            aria-label="icon ashbin"
            onClick={() => {
              console.log('click icon');
            }}
          />
          {userState._id === voteState.owner ? (
            <Icon
              className={styles.iconButton}
              type="set"
              role="button"
              aria-label="icon set"
              onClick={onSettingClick}
            />
          ) : null}
          <CustomIcon
            className={styles.iconButton}
            style={{ marginTop: 2 }}
            type="share2"
            role="button"
            aria-label="icon share"
            onClick={() => {
              console.log('click icon');
            }}
          />
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
    </div>
  );
};

export default VoteInfo;
