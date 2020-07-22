import React, { useState } from 'react';
import { useRequest, store, history } from 'ice';
import loginService from '@/pages/Login/services/login';
import { Input, Message, Form } from '@alifd/next';
import SubmitBtn from '@/components/submitBtn';
import styles from './index.module.scss';

import axios from 'axios';

const { Item } = Form;
const DEFAULT_DATA = {
  account: '',
  password: '',
};

const LoginBlock = (props) => {
  const { dataSource = DEFAULT_DATA } = props;
  const [postData, setValue] = useState(dataSource);
  const [userState, userDispatchers] = store.useModel('user');
  const { data, loading, request } = useRequest(loginService.getToken, {
    onSuccess: async (result, params) => {
      const token = result.token;
      console.log(token);
      localStorage.setItem('jwt-token', token);
      await userDispatchers.fetchUserInfo();
      // console.log('res:', res);
      // console.log('userState:', userState);
      history.push('/');
      Message.success('登录成功');
    },
    onError: () => {
      Message.error('登录失败');
    },
  });

  const handleSubmit = async (values, errors) => {
    if (errors) {
      console.log('errors', errors);
      Message.error('登录失败');
      return;
    }

    console.log('values:', values);
    // let sth = await request(values);
    // console.log('sth:', sth);
    // console.log('data:', data);
    request(values);

    // let testdata = await axios.post(
    //   'http://127.0.0.1:7001/api/user/login',
    //   values
    // );
    // console.log('testdata:', testdata.data);
  };

  return (
    <div className={styles.LoginBlock}>
      <div className={styles.innerBlock}>
        <div className={styles.title}>Elezoo</div>
        <div className={styles.explain}>
          在 Elezoo
          这个平台，任何小组可以发起倡议性投票，即投票参与人可以对投票选项进行提议。
        </div>
        <div className={styles.subtitle}>登录账号</div>

        <Form value={postData} size="large">
          <Item required requiredMessage="必填">
            <Input name="account" placeholder="用户名或邮箱" />
          </Item>
          <Item required requiredMessage="必填">
            <Input.Password
              name="password"
              htmlType="password"
              placeholder="密码"
            />
          </Item>
          <Item>
            <SubmitBtn
              type="primary"
              onClick={handleSubmit}
              className={styles.submitBtn}
              validate
            >
              登录
            </SubmitBtn>
          </Item>
          <p className={styles.infoLine}>
            <a href="/" className={styles.link}>
              忘记密码
            </a>
            <a href="/#/user/register" className={styles.link}>
              注册账号
            </a>
          </p>
          <div className={styles.buttomBlock} />
        </Form>
      </div>
    </div>
  );
};

export default LoginBlock;
