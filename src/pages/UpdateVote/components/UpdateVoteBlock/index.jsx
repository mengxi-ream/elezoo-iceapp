import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { useRequest, store, useHistory, useParams } from 'ice';
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
import voteDetailService from '@/services/voteDetail';
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

const UpdateVoteBlock = () => {
  const { id } = useParams();
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
  const [voteState, voteDispatchers] = store.useModel('voteDetail');
  // const [postData, setValue] = useState(voteState);
  const { data, loading, request } = useRequest(voteDetailService.getVote, {
    onSuccess: async (result) => {
      console.log(result);
      await voteDispatchers.fetchVote(result);
      setValue(result);
      if (result.cover) {
        setPicData({
          uid: 0,
          name: 'This is your original cover.',
          state: 'success',
          url: result.cover,
        });
      }
      // Message.success('加载成功');
    },
    onError: () => {
      Message.error('加载失败');
    },
  });

  const {
    data: updateData,
    loading: updateLoading,
    request: updateRequest,
  } = useRequest(voteDetailService.updateBasic, {
    onSuccess: async (result) => {
      console.log(result);
      await voteDispatchers.fetchVote(result);

      Message.success('修改成功');
    },
    onError: (err) => {
      err.response
        ? Message.error(err.response.data.message)
        : Message.error('修改失败');
    },
  });

  useEffect(() => {
    request(id);
  }, []);

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
    updateRequest(id, values);
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

  const disabledDate = function (date, view) {
    switch (view) {
      case 'date':
        return date.valueOf() < currentDate.valueOf() - 24 * 60 * 60 * 1000;
      case 'year':
        return date.year() < currentDate.year();
      case 'month':
        return (
          date.year() * 100 + date.month() <
          currentDate.year() * 100 + currentDate.month()
        );
      default:
        return false;
    }
  };

  const onProposeChange = (values) => {
    setValue({ ...postData, proposeStart: values[0], voteStart: values[1] });
    // console.log(values[0]);
    // console.log(values[1]);
  };

  const onVoteChange = (values) => {
    setValue({ ...postData, voteStart: values[0], voteEnd: values[1] });
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

  const TimeLabel = ({ text }) => (
    <span>
      {text}{' '}
      <Balloon
        type="primary"
        trigger={<Icon type="prompt" size="small" />}
        closable={false}
        align="t"
      >
        <div>若选择结束时间，则必须选择开始时间</div>
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
      <Card.Content className={styles.settingPageBlock}>
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
            {/* <Input name="detail" placeholder="关于投票的详细介绍"/> */}
            <Input.TextArea
              name="detail"
              autoHeight={{ minRows: 2, maxRows: 4 }}
              placeholder="关于投票的详细介绍"
            />
          </Form.Item>
          <Form.Item colSpan={12} label="封面">
            <UploadCover />
          </Form.Item>
          <Form.Item colSpan={12} label={<TimeLabel text={'提议时间'} />}>
            <RangePicker
              disabledDate={disabledDate}
              showTime={{ format: 'HH:mm' }}
              placeholder={['开始时间', '结束时间']}
              style={{ width: '100%' }}
              // onOk={onProposeOk}
              onChange={onProposeChange}
              value={[postData.proposeStart, postData.voteStart]}
            />
          </Form.Item>
          <Form.Item colSpan={12} label={<TimeLabel text={'投票时间'} />}>
            <RangePicker
              disabledDate={disabledDate}
              showTime={{ format: 'HH:mm' }}
              placeholder={['开始时间', '结束时间']}
              style={{ width: '100%' }}
              // onOk={onVoteOk}
              onChange={onVoteChange}
              value={[postData.voteStart, postData.voteEnd]}
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
              value={postData.privacyOption}
              showSearch
              hasClear
              style={{ width: '100%' }}
              disabled
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
              disabled
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
              loading={updateLoading}
              validate
              onClick={handleSubmit}
              style={{ display: 'block', margin: '0 auto' }}
            >
              修改投票
            </SubmitBtn>
          </Form.Item>
        </Form>
      </Card.Content>
    </Card>
  );
};

export default UpdateVoteBlock;
