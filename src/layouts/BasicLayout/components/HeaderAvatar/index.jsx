import React, { useEffect } from 'react';
import { history, store } from 'ice';
import { Avatar, Overlay, Menu, Icon } from '@alifd/next';
import styles from './index.module.scss';

const { Item } = Menu;
const { Popup } = Overlay;

const UserProfile = ({ userName, avatar, email }) => (
  <div className={styles.profile}>
    <div className={styles.avatar}>
      <Avatar src={avatar} alt="用户头像" />
    </div>
    <div className={styles.content}>
      <h4>{userName}</h4>
      <span>{email}</span>
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
          <Avatar size="small" src={userState.avatar} alt="用户头像" />
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
      <div className={styles.avatarPopup}>
        <UserProfile {...userState} />
        <Menu className={styles.menu}>
          <Item
            onClick={() => {
              history.push('/person');
            }}
          >
            <Icon size="small" type="account" />
            个人设置
          </Item>
          <Item
            onClick={() => {
              history.push('/settings');
            }}
          >
            <Icon size="small" type="set" />
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
      </div>
    </Popup>
  );
};

export default HeaderAvatar;
