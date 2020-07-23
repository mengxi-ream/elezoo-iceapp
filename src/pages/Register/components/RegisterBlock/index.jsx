import React, { useState } from 'react';
import { useRequest, store, history } from 'ice';
import PropTypes from 'prop-types';
import { Input, Message, Form } from '@alifd/next';
import SubmitBtn from '@/components/submitBtn';
// import { createUser } from './utils';
import userService from '@/services/user';
import styles from './index.module.scss';

const { Item } = Form;

export default function RegisterBlock() {
  const [postData, setValue] = useState({
    userName: '',
    email: '',
    password: '',
    rePassword: '',
  });
  const dispatchers = store.useModelDispatchers('user');
  const { data, loading, request } = useRequest(userService.createUser, {
    onSuccess: async (result, params) => {
      // console.log('result:', result);
      // console.log('params:', params[0]);
      const userInfo = params[0];
      // 欺骗拦截器不要跳转到 /user/login 界面
      localStorage.setItem('jwt-token', 'tempToken');
      const res = await userService.getToken({
        account: userInfo.userName,
        password: userInfo.password,
      });
      const token = res.token;
      console.log(token);
      localStorage.setItem('jwt-token', token);
      await dispatchers.fetchUserInfo();
      history.push('/');
      Message.success('注册成功');
    },
    onError: (err) => {
      const result = err.response.data;
      // console.log('result:', result);
      result.code === 409
        ? Message.error(result.message)
        : Message.error('注册失败');
    },
  });

  //及时更新，保证 checkPass 函数正常运行
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
      Message.error('注册失败');
      return;
    }

    console.log('values:', values);
    request(values);
    // (await createUser(values))
    //   ? Message.success('注册成功')
    //   : Message.error('注册失败');
  };

  return (
    <div className={styles.RegisterBlock}>
      <div className={styles.innerBlock}>
        <div className={styles.title}>Elezoo</div>
        <div className={styles.explain}>
          在 Elezoo
          这个平台，任何小组可以发起倡议性投票，即投票参与人可以对投票选项进行提议。
        </div>
        <div className={styles.subtitle}>注册账号</div>

        <Form value={postData} onChange={formChange} size="large">
          <Item
            hasFeedback
            required
            requiredMessage="必填"
            minLength={2}
            maxLength={15}
            pattern={/^[a-zA-Z\u4E00-\u9FA5][a-zA-Z0-9\u4E00-\u9FA5_-]{1,14}$/}
            patternMessage="必须以英文字母或汉字开头，特殊字符仅允许下划线和减号"
          >
            <Input
              name="userName"
              size="large"
              maxLength={15}
              placeholder="用户名"
            />
          </Item>
          <Item
            format="email"
            hasFeedback
            required
            requiredMessage="必填"
            maxLength={30}
          >
            <Input name="email" size="large" placeholder="邮箱" />
          </Item>
          <Item
            required
            requiredMessage="必填"
            minLength={6}
            maxLength={20}
            pattern={/^.*(?=.{6,})(?=.*\d)(?=.*[a-zA-Z]).*$/}
            patternMessage="必须同时含有英文和数字"
          >
            <Input.Password
              name="password"
              size="large"
              htmlType="password"
              placeholder="至少六位密码，区分大小写"
            />
          </Item>
          <Item
            required
            requiredTrigger="onFocus"
            requiredMessage="必填"
            validator={checkPass}
          >
            <Input.Password
              name="rePassword"
              size="large"
              htmlType="password"
              placeholder="确认密码"
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
              注册账号
            </SubmitBtn>
          </Item>
          <Item
            style={{
              textAlign: 'center',
            }}
          >
            <a href="/#/user/login" className={styles.link}>
              使用已有账号登录
            </a>
          </Item>
        </Form>
        <div className={styles.buttomBlock} />
      </div>
    </div>
  );
}
RegisterBlock.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  value: PropTypes.object,
};
RegisterBlock.defaultProps = {
  value: {},
};
