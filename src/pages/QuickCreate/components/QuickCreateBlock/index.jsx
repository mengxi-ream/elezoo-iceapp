import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { useRequest, store, useHistory, useParams } from 'ice';
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
const periodOrder = {
  proposing: 1,
  voting: 2,
  end: 3,
};

const QuickCreateBlock = () => {
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

  const { data, loading, request } = useRequest(voteDetailService.createVote, {
    onSuccess: async (result) => {
      // console.log('updatedInfo:', result);
      console.log(result);
      setValue({
        title: undefined,
        detail: undefined,
        cover: undefined,
        proposeStart: undefined,
        voteStart: undefined,
        voteEnd: undefined,
        privacyOption: 'realName',
        showProposer: true,
        multiChoice: true,
      });
      history.push(`/vote/notstarted/${result._id}`);
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

  const onPrivacyOptionChange = (value) => {
    setValue({ ...postData, privacyOption: value, showProposer: '' });
  };

  const onShowProposerChange = (value) => {
    setValue({ ...postData, showProposer: value });
  };

  const onMultiChoiceChange = (value) => {
    setValue({ ...postData, multiChoice: value });
  };

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
            <Input.TextArea
              name="detail"
              autoHeight={{ minRows: 2, maxRows: 4 }}
              placeholder="关于投票的详细介绍"
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

export default QuickCreateBlock;
