import React, { useState, useEffect } from 'react';
import { useRequest, useParams, store } from 'ice';
import { Avatar, Icon, Grid, Tag } from '@alifd/next';
import voteDetailService from '@/services/voteDetail';
import styles from './index.module.scss';
import moment from 'moment';

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
  const { voteState } = props;
  return (
    <div>
      <div className={styles.tools}>
        <Tag type="primary" color={periodColors[voteState.period]}>
          {periodLabels[voteState.period]}
        </Tag>
        <div>
          <Icon
            className={styles.toolButton}
            type="ashbin"
            role="button"
            aria-label="icon ashbin"
            onClick={() => {
              console.log('click icon');
            }}
          />
          <Icon
            className={styles.toolButton}
            type="set"
            role="button"
            aria-label="icon set"
            onClick={() => {
              console.log('click icon');
            }}
          />
          <Icon
            className={styles.toolButton}
            type="upload"
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
