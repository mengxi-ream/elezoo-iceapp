import React, { useState } from 'react';
import moment from 'moment';
import { useRequest, store, useHistory } from 'ice';
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
  Icon,
  DatePicker,
  Select,
  Balloon,
} from '@alifd/next';
import PageTab from '@/components/PageTab';
import SubmitBtn from '@/components/SubmitBtn';
import voteService from '@/pages/Vote/services/vote';
import styles from './index.module.scss';

const { Cell } = ResponsiveGrid;
const { RangePicker } = DatePicker;
const currentDate = moment();

const privacyOptions = [
  { label: '实名', value: 'realName' },
  { label: '自由', value: 'free' },
  { label: '匿名', value: 'anonymity' },
];
const showOptions = {
  realName: [
    { label: '显示提议人', value: true },
    { label: '不显示提议人', value: false },
  ],
  free: [
    { label: '显示提议人', value: true },
    { label: '不显示提议人', value: false },
  ],
  anonymity: [{ label: '不显示提议人', value: false }],
};
const choiceOptions = [
  { label: '多选投票', value: true },
  { label: '单选投票', value: false },
];

const CreateVote = () => {
  const history = useHistory();
  const [postData, setValue] = useState({
    // title: undefined,
    // detail: undefined,
    // cover: undefined,
    // proposeStart: undefined,
    // voteStart: undefined,
    // voteEnd: undefined,
    privacyOption: 'realName',
    showProposer: true,
    multiChoice: true,
  });
  const [picData, setPicData] = useState();
  const [voteState, voteDispatchers] = pageStore.useModel('vote');
  const { data, loading, request } = useRequest(voteService.createVote, {
    onSuccess: async (result) => {
      // console.log('updatedInfo:', result);
      console.log(result);
      await voteDispatchers.changeSubmit(true);
      setValue({
        title: undefined,
        detail: undefined,
        cover: undefined,
        proposeStart: undefined,
        voteStart: undefined,
        voteEnd: undefined,
        privacyOption: 'realName',
        showProposer: false,
        multiChoice: true,
      });
      history.push(`/vote/${result.period}/${result._id}`);
      Message.success('创建成功');
    },
    onError: (err) => {
      err.response
        ? Message.error(err.response.data.message)
        : Message.error('创建失败');
    },
  });

  const formChange = (value) => {
    setValue({ ...postData, ...value });
  };

  const handleSubmit = async (values, errors) => {
    if (errors) {
      console.log('errors', errors);
      Message.error('创建失败');
      return;
    }
    console.log(values);
    request(values);
  };

  const uploadSuccess = (value) => {
    const url = value.response.url;
    // console.log(value);
    // console.log(url);
    setValue({ ...postData, cover: url });
    setPicData(value);
  };

  const uploadError = (err) => {
    Message.error('上传失败');
  };

  const uploadRemove = () => {
    setValue({ ...postData, cover: undefined });
    setPicData(undefined);
  };

  const disabledProposeDate = (date) => {
    if (date.valueOf() < currentDate.valueOf() - 24 * 60 * 60 * 1000 + 1)
      return true;
    if (postData.voteStart && date.valueOf() > postData.voteStart.valueOf())
      return true;
    return false;
  };

  const disabledVoteDate = (date) => {
    if (date.valueOf() < currentDate.valueOf() - 24 * 60 * 60 * 1000 + 1)
      return true;
    if (
      postData.proposeStart &&
      date.valueOf() < postData.proposeStart.valueOf() - 24 * 60 * 60 * 1000 + 1
    )
      return true;
    if (postData.voteEnd && date.valueOf() > postData.voteEnd.valueOf())
      return true;
    return false;
  };

  const disabledEndDate = (date) => {
    if (date.valueOf() < currentDate.valueOf() - 24 * 60 * 60 * 1000 + 1)
      return true;
    if (
      postData.voteStart &&
      date.valueOf() < postData.voteStart.valueOf() - 24 * 60 * 60 * 1000 + 1
    )
      return true;
    return false;
  };

  const handleTimeChange = (field, val) => {
    setValue({ ...postData, [field]: val });
  };

  const onPrivacyOptionChange = (value) => {
    setValue({ ...postData, privacyOption: value, showProposer: '' });
  };

  const onShowProposerChange = (value) => {
    setValue({ ...postData, showProposer: value });
  };

  const onMultiChoiceChange = (value) => {
    setValue({ ...postData, multiChoice: value });
  };

  const UploadCover = () => (
    <Upload.Dragger
      listType="image"
      action="http://127.0.0.1:7001/api/pic/stream"
      method="post"
      formatter={(res, file) => {
        // 函数里面根据当前服务器返回的响应数据
        // 重新拼装符合组件要求的数据格式
        return {
          success: res.code === 201,
          url: res.data.url,
        };
      }}
      accept="image/png, image/jpg, image/jpeg"
      limit={1}
      onSuccess={uploadSuccess}
      onError={uploadError}
      onRemove={uploadRemove}
      value={
        picData && [
          {
            uid: picData.uid,
            name: picData.name,
            state: picData.state,
            url: picData.url,
            size: picData.size,
          },
        ]
      }
    >
      <div className="next-upload-drag">
        <p className="next-upload-drag-icon">
          <Icon type="upload" />
        </p>
        <p className="next-upload-drag-text">点击或者拖动文件到虚线框内上传</p>
        <p className="next-upload-drag-hint">支持 PNG, JPG, JPEG 文件</p>
      </div>
    </Upload.Dragger>
  );

  const ProposeLabel = () => (
    <span>
      提议开始{' '}
      <Balloon
        type="primary"
        trigger={<Icon type="prompt" size="small" />}
        closable={false}
        align="t"
      >
        <div>参与人开始对投票选项进行提议的时间</div>
      </Balloon>
    </span>
  );

  const TimeLabel = ({ now, last }) => (
    <span>
      {now}{' '}
      <Balloon
        type="primary"
        trigger={<Icon type="prompt" size="small" />}
        closable={false}
        align="t"
      >
        <div>{`${now}时间需大于${last}时间`}</div>
      </Balloon>
    </span>
  );

  const PrivacyLabel = () => (
    <span>
      隐私选项{' '}
      <Balloon
        type="primary"
        trigger={<Icon type="prompt" size="small" />}
        closable={false}
        align="t"
      >
        <div>
          <div>实名：参与人不能匿名提交信息</div>
          <div>自由：参与人可以选择匿名提交信息</div>
          <div>匿名：参与人全部匿名提交信息</div>
        </div>
      </Balloon>
    </span>
  );

  return (
    <Card free>
      <Card.Content className={styles.SettingPageBlock}>
        <Form
          responsive
          labelAlign="top"
          value={postData}
          onChange={formChange}
        >
          <Form.Item
            colSpan={12}
            label="标题"
            maxLength={20}
            required
            requiredMessage="必填"
          >
            <Input name="title" placeholder="投票标题" />
          </Form.Item>
          <Form.Item colSpan={12} maxLength={100} label="介绍">
            <Input.TextArea
              name="detail"
              autoHeight={{ minRows: 2, maxRows: 4 }}
              placeholder="关于投票的详细介绍"
            />
          </Form.Item>
          <Form.Item colSpan={12} label="封面">
            <UploadCover />
          </Form.Item>
          <Form.Item colSpan={4} label={<ProposeLabel />}>
            <DatePicker
              disabledDate={disabledProposeDate}
              showTime={{ format: 'HH:mm' }}
              placeholder={'输入时间'}
              // onOk={onVoteOk}
              onChange={(val) => handleTimeChange('proposeStart', val)}
              value={postData.proposeStart}
              style={{ width: '100%' }}
            />
          </Form.Item>
          <Form.Item
            colSpan={4}
            label={<TimeLabel now={'投票开始'} last={'提议开始'} />}
          >
            <DatePicker
              disabledDate={disabledVoteDate}
              showTime={{ format: 'HH:mm' }}
              placeholder={'输入时间'}
              // onOk={onVoteOk}
              onChange={(val) => handleTimeChange('voteStart', val)}
              value={postData.voteStart}
              style={{ width: '100%' }}
            />
          </Form.Item>
          <Form.Item
            colSpan={4}
            label={<TimeLabel now={'投票结束'} last={'投票开始'} />}
          >
            <DatePicker
              disabledDate={disabledEndDate}
              showTime={{ format: 'HH:mm' }}
              placeholder={'输入时间'}
              // onOk={onVoteOk}
              onChange={(val) => handleTimeChange('voteEnd', val)}
              value={postData.voteEnd}
              style={{ width: '100%' }}
            />
          </Form.Item>
          <Form.Item
            colSpan={4}
            label={<PrivacyLabel />}
            required
            requiredMessage="必填"
          >
            <Select
              onChange={onPrivacyOptionChange}
              dataSource={privacyOptions}
              defaultValue="realName"
              showSearch
              hasClear
              style={{ width: '100%' }}
            />
          </Form.Item>
          <Form.Item
            colSpan={4}
            label="提议人显示"
            required
            requiredMessage="必填"
          >
            <Select
              name="showProposer"
              onChange={onShowProposerChange}
              dataSource={showOptions[postData.privacyOption]}
              value={postData.showProposer}
              showSearch
              hasClear
              style={{ width: '100%' }}
            />
          </Form.Item>
          <Form.Item
            colSpan={4}
            label="多选或单选"
            required
            requiredMessage="必填"
          >
            <Select
              name="multiChoice"
              onChange={onMultiChoiceChange}
              dataSource={choiceOptions}
              value={postData.multiChoice}
              showSearch
              hasClear
              style={{ width: '100%' }}
            />
          </Form.Item>
          <Form.Item
            colSpan={12}
            style={{
              marginTop: 32,
            }}
          >
            <SubmitBtn
              type="primary"
              loading={loading}
              validate
              onClick={handleSubmit}
              style={{ display: 'block', margin: '0 auto' }}
            >
              创建投票
            </SubmitBtn>
          </Form.Item>
        </Form>
      </Card.Content>
    </Card>
  );
};

export default CreateVote;
