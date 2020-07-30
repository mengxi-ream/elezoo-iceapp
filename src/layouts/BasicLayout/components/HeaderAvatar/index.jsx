import React, { useEffect } from 'react';
import { history, store } from 'ice';
import { Avatar, Overlay, Menu, Icon, Divider } from '@alifd/next';
import styles from './index.module.scss';

const { Item } = Menu;
const { Popup } = Overlay;

const UserProfile = ({ userName, avatar, email }) => (
  <div className={styles.profile}>
    <div className={styles.avatar}>
      <Avatar src={avatar} alt="用户头像" size="large" />
    </div>
    <div className={styles.content}>
      <div className={styles.userName}>{userName}</div>
      <div className={styles.email}>{email}</div>
    </div>
  </div>
);

const HeaderAvatar = (props) => {
  const [userState, userDispatchers] = store.useModel('user');

  useEffect(() => {
    // 调用 user 模型中的 fetchUserInfo 方法
    userDispatchers.fetchUserInfo();
  }, []);

  return (
    <Popup
      trigger={
        <div className={styles.headerAvatar}>
          <Avatar
            src={userState.avatar}
            alt="用户头像"
            style={{ width: 30, height: 30 }}
          />
          {/* <span
            style={{
              marginLeft: 10,
            }}
          >
            {userState.userName}
          </span> */}
        </div>
      }
      triggerType="click"
    >
      {/* <div className={styles.avatarPopup}> */}
      {/* <UserProfile {...userState} /> */}
      <Menu className={styles.menu}>
        <UserProfile {...userState} />
        <Divider style={{ margin: '8px 0' }} />
        <Item
          onClick={() => {
            history.push('/setting');
          }}
        >
          <Icon size="small" type="account" />
          个人设置
        </Item>
        <Item
          onClick={() => {
            history.push('/help');
          }}
        >
          <Icon size="small" type="help" />
          帮助
        </Item>
        <Item
          onClick={() => {
            // window.open('/#/user/login');
            // window.close();
            localStorage.removeItem('jwt-token');
            history.push('/user/login');
          }}
        >
          <Icon size="small" type="exit" />
          退出
        </Item>
      </Menu>
      {/* </div> */}
    </Popup>
  );
};

export default HeaderAvatar;
