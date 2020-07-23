import React, { useState } from 'react';
import { useRequest, store } from 'ice';
import { Button, Card, Form, Input, Message } from '@alifd/next';
import PageTab from '@/components/PageTab';
import SubmitBtn from '@/components/SubmitBtn';
import userService from '@/services/user';
import styles from './index.module.scss';

const PswInput = (props) => {
  const { label, placeholder, name, validator } = props;
  return (
    <Form.Item
      label={label}
      required
      requiredMessage="必填"
      minLength={6}
      maxLength={20}
      colSpan={12}
      pattern={/^.*(?=.{6,})(?=.*\d)(?=.*[a-zA-Z]).*$/}
      patternMessage="必须同时含有英文和数字"
      validator={validator}
    >
      <Input htmlType="password" placeholder={placeholder} name={name} />
    </Form.Item>
  );
};

const UpdatePsw = () => {
  const [postData, setValue] = useState({
    oldPassword: '',
    password: '',
    rePassword: '',
  });
  const { data, loading, request } = useRequest(userService.updatePsw, {
    onSuccess: () => {
      Message.success('更新成功');
    },
    onError: () => {
      Message.error('更新失败');
    },
  });

  const formChange = (value) => {
    setValue(value);
  };

  const checkPass = (rule, values, callback) => {
    if (values && values !== postData.password) {
      return callback('密码不一致');
    }
    return callback();
  };

  const handleSubmit = async (values, errors) => {
    if (errors) {
      console.log('errors', errors);
      Message.error('更新失败');
      return;
    }

    console.log('values:', values);
    request(values);
  };

  return (
    <Card free>
      <Card.Content className={styles.SettingPageBlock}>
        <Form labelAlign="top" value={postData} onChange={formChange}>
          <PswInput
            label="原始密码"
            placeholder="请输入原始密码"
            name="oldPassword"
          />
          <PswInput
            label="新密码"
            placeholder="至少六位密码，区分大小写"
            name="password"
          />
          <PswInput
            label="确认新密码"
            placeholder="至少六位密码，区分大小写"
            name="rePassword"
            validator={checkPass}
          />
          <Form.Item
            colSpan={12}
            style={{
              marginTop: 16,
            }}
          >
            <SubmitBtn
              type="primary"
              loading={loading}
              validate
              onClick={handleSubmit}
              style={{ display: 'block', margin: '0 auto' }}
            >
              更新密码
            </SubmitBtn>
          </Form.Item>
        </Form>
      </Card.Content>
    </Card>
  );
};

export default UpdatePsw;
