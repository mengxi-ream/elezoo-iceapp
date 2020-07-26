import React, { useState } from 'react';
import { useRequest, store } from 'ice';
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
} from '@alifd/next';
import PageTab from '@/components/PageTab';
import SubmitBtn from '@/components/SubmitBtn';
import userService from '@/services/user';
import styles from './index.module.scss';

const { Cell } = ResponsiveGrid;
const { RangePicker } = DatePicker;

const CreateVote = () => {
  const [postData, setValue] = useState({
    title: '',
    detail: '',
    cover: '',
    proposeStart: '',
    voteStart: '',
    voteEnd: '',
    privacyOption: '',
    showProposer: false,
  });
  const handleSubmit = async (values, errors) => {
    if (errors) {
      console.log('errors', errors);
      Message.error('创建失败');
      return;
    }
    console.log(values);
    Message.success('创建成功');
  };

  const uploadSuccess = async (info) => {
    const url = info.response.url;
    console.log({ url });
    setValue({ cover: url });
    // console.log('onSuccess: ', info);
  };

  const uploadError = (err) => {
    Message.error('上传失败');
  };

  const UploadCover = () => (
    <Upload.Dragger
      listType="image"
      action="http://127.0.0.1:7001/api/pic/stream"
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
      method="post"
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

  return (
    <Card free>
      <Card.Content className={styles.SettingPageBlock}>
        <Form labelAlign="top">
          <Form.Item
            colSpan={12}
            label="标题"
            maxLength={15}
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
          <Form.Item colSpan={12} label="提议时间">
            <RangePicker
              showTime={{ format: 'HH:mm' }}
              placeholder={['开始时间', '结束时间']}
              style={{ width: '100%' }}
            />
          </Form.Item>
          <Form.Item colSpan={12} label="投票时间">
            <RangePicker
              showTime={{ format: 'HH:mm' }}
              placeholder={['开始时间', '结束时间']}
              style={{ width: '100%' }}
            />
          </Form.Item>
          <Form.Item colSpan={12} label="隐私选项">
            <Input />
          </Form.Item>
          <Form.Item colSpan={12} label="显示提议人">
            <Input />
          </Form.Item>
          <Form.Item
            colSpan={12}
            style={{
              marginTop: 32,
            }}
          >
            <SubmitBtn
              type="primary"
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
