import React, { useState } from 'react';
import { useRequest, store, history } from 'ice';
// import loginService from '@/pages/Login/services/login';
import userService from '@/services/user';
import { Input, Message, Form } from '@alifd/next';
import SubmitBtn from '@/components/SubmitBtn';
import styles from './index.module.scss';

const { Item } = Form;
const DEFAULT_DATA = {
  account: '',
  password: '',
};

const LoginBlock = (props) => {
  const [sendState, setSend] = useState(false);
  const { loading, request } = useRequest(userService.forget, {
    onSuccess: (result) => {
      console.log(result);
      setSend(true);
      Message.success('发送成功');
    },
    onError: () => {
      Message.error('发送失败');
    },
  });

  const handleSubmit = async (values) => {
    console.log('values:', values);
    // let sth = await request(values);
    // console.log('sth:', sth);
    // console.log('data:', data);
    request(values);
  };

  return (
    <div className={styles.LoginBlock}>
      <div className={styles.innerBlock}>
        {/* <div className={styles.title}>Elezoo</div> */}
        <img
          className={styles.title}
          src="/public/logo/textlogo.png"
          alt="logo"
        />
        <div className={styles.explain}>
          在 Elezoo
          这个平台，任何小组可以发起倡议性投票，即投票参与人可以对投票选项进行提议。
        </div>
        {sendState ? (
          <Form size="large">
            <Item>
              <SubmitBtn
                type="primary"
                loading={loading}
                onClick={handleSubmit}
                className={styles.submitBtn}
                validate
              >
                进入登录界面
              </SubmitBtn>
            </Item>
            <Item
              style={{
                textAlign: 'center',
              }}
            >
              <a href="/#/user/register" className={styles.link}>
                注册新账号
              </a>
            </Item>
            <div className={styles.buttomBlock} />
          </Form>
        ) : (
          <div>
            <div className={styles.subtitle}>忘记密码</div>
            <Form size="large">
              <Item required requiredMessage="必填">
                <Input
                  // className={styles.customInput}
                  name="email"
                  placeholder="输入用户邮箱"
                />
              </Item>
              <Item>
                <SubmitBtn
                  type="primary"
                  loading={loading}
                  onClick={handleSubmit}
                  className={styles.submitBtn}
                  validate
                >
                  发送重置邮件
                </SubmitBtn>
              </Item>

              <p className={styles.infoLine}>
                <a href="/#/user/login" className={styles.link}>
                  登录账号
                </a>
                <a href="/#/user/register" className={styles.link}>
                  注册账号
                </a>
              </p>
              <div className={styles.buttomBlock} />
            </Form>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginBlock;
