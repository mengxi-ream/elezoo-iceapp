import React, { useState } from 'react';
import { useRequest, store, useHistory, useParams, useSearchParams } from 'ice';
// import loginService from '@/pages/Login/services/login';
import userService from '@/services/user';
import { Input, Message, Form } from '@alifd/next';
import SubmitBtn from '@/components/SubmitBtn';
import styles from './index.module.scss';

const { Item } = Form;

const ResetBlock = () => {
  const history = useHistory();
  const { id } = useParams();
  const { uuid } = useSearchParams();
  const [postData, setValue] = useState({});
  const dispatchers = store.useModelDispatchers('user');
  const { loading, request } = useRequest(userService.reset, {
    onSuccess: async (result, params) => {
      console.log(result);
      console.log(params);
      localStorage.setItem('jwt-token', 'tempToken');
      // console.log(token);
      const res = await userService.getToken({
        account: result.userName,
        password: params[1].password,
      });
      const token = res.token;
      console.log(token);
      localStorage.setItem('jwt-token', token);
      await dispatchers.fetchUserInfo();
      history.push('/');
      Message.success('登录成功');
    },
    onError: () => {
      Message.error('发送失败');
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
      Message.error('修改失败');
      return;
    }
    console.log('values:', values);
    request(id, { uuid, password: values.password });
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

        <div className={styles.subtitle}>重置密码</div>
        <Form data={postData} onChange={formChange} size="large">
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
              确认修改
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
    </div>
  );
};

export default ResetBlock;
