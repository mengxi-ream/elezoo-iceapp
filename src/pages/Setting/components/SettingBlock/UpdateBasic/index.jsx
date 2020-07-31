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
} from '@alifd/next';
import PageTab from '@/components/PageTab';
import SubmitBtn from '@/components/SubmitBtn';
import userService from '@/services/user';
import styles from './index.module.scss';

const { Cell } = ResponsiveGrid;

const UpdateBasic = () => {
  const [userState, userDispatchers] = store.useModel('user');
  const { data, loading, request } = useRequest(userService.updateBasic, {
    onSuccess: async (result) => {
      // console.log('updatedInfo:', result);
      await userDispatchers.fetchUserInfo();
      Message.success('更新成功');
    },
    onError: (err) => {
      err.response
        ? Message.error(err.response.data.message)
        : Message.error('更新失败');
    },
  });
  // const [postData, setValue] = useState({
  //   userName: '',
  //   email: '',
  //   avatar: '',
  // });

  // const formChange = (value) => {
  //   setValue(value);
  // };

  const handleSubmit = async (values, errors) => {
    if (errors) {
      console.log('errors', errors);
      Message.error('更新失败');
      return;
    }

    // remove empty fields then request
    Object.keys(values).forEach(
      (key) => values[key] === '' && delete values[key]
    );
    console.log('values:', values);
    request(values);
    // let testres = await uploadService.pic();
    // console.log('testres:', testres);
  };

  const uploadSuccess = async (info) => {
    const { url: avatar, urlBackup: avatarBackup } = info.response.data;
    console.log({ avatar, avatarBackup });
    request({ avatar, avatarBackup });
    // console.log('onSuccess: ', info);
  };

  const uploadError = (err) => {
    Message.error('上传失败');
  };

  return (
    <Card free>
      <Card.Content className={styles.settingPageBlock}>
        <Form labelAlign="top" responsive>
          <Form.Item label="" colSpan={12}>
            <div className={styles.avatar}>
              <Avatar shape="circle" size={64} src={userState.avatar} />
            </div>
            <Upload
              className={styles.changeLogo}
              action="http://127.0.0.1:7001/api/pic/stream"
              onSuccess={uploadSuccess}
              onError={uploadError}
              method="post"
              data={{ backup: true }}
              // request={uploadService.pic}
              name="img"
              accept="image/png, image/jpg, image/jpeg"
            >
              <Button loading={loading} type="normal">
                更新头像
              </Button>
            </Upload>
          </Form.Item>
          <Form.Item colSpan={12}>
            <Divider />
          </Form.Item>
          <Form.Item
            label="用户名"
            hasFeedback
            minLength={2}
            maxLength={15}
            pattern={/^[a-zA-Z\u4E00-\u9FA5][a-zA-Z0-9\u4E00-\u9FA5_-]{1,14}$/}
            patternMessage="必须以英文字母或汉字开头，特殊字符仅允许下划线和减号"
            colSpan={12}
          >
            <Input
              defaultValue={userState.userName}
              placeholder="用户名"
              name="userName"
            />
          </Form.Item>

          <Form.Item label="邮箱" hasFeedback format="email" colSpan={12}>
            <Input
              defaultValue={userState.email}
              placeholder="邮箱"
              name="email"
            />
          </Form.Item>

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
              更新信息
            </SubmitBtn>
          </Form.Item>
        </Form>
      </Card.Content>
    </Card>
  );
};

export default UpdateBasic;
