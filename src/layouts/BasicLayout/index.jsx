import React, { useState } from 'react';
import { Shell, ConfigProvider, Search, Tag } from '@alifd/next';
import { useHistory } from 'ice';
import PageNav from './components/PageNav';
import Logo from './components/Logo';
import Footer from './components/Footer';
import HeaderAvatar from './components/HeaderAvatar';
import styles from './index.module.scss';

(function () {
  const throttle = function (type, name, obj = window) {
    let running = false;

    const func = () => {
      if (running) {
        return;
      }

      running = true;
      requestAnimationFrame(() => {
        obj.dispatchEvent(new CustomEvent(name));
        running = false;
      });
    };

    obj.addEventListener(type, func);
  };

  if (typeof window !== 'undefined') {
    throttle('resize', 'optimizedResize');
  }
})();

export default function BasicLayout({ children }) {
  const getDevice = (width) => {
    const isPhone =
      typeof navigator !== 'undefined' &&
      navigator &&
      navigator.userAgent.match(/phone/gi);

    if (width < 680 || isPhone) {
      return 'phone';
    }
    if (width < 1280 && width > 680) {
      return 'tablet';
    }
    return 'desktop';
  };

  const history = useHistory();
  const [device, setDevice] = useState(getDevice(NaN));

  if (typeof window !== 'undefined') {
    window.addEventListener('optimizedResize', (e) => {
      const deviceWidth = (e && e.target && e.target.innerWidth) || NaN;
      setDevice(getDevice(deviceWidth));
    });
  }

  return (
    <ConfigProvider device={device}>
      <Shell
        className={styles.shell}
        type="light"
        style={{
          minHeight: '100vh',
        }}
      >
        <Shell.Branding>
          <Logo image="/public/logo/textlogo.png" />
        </Shell.Branding>
        <Shell.Navigation
          direction="hoz"
          style={{
            marginRight: 24,
          }}
        >
          <div
            className={styles.textNav}
            onClick={() => {
              history.push('/quick');
            }}
          >
            快速创建
          </div>
          <div
            className={styles.textNav}
            onClick={() => {
              history.push('/');
            }}
          >
            我的投票
          </div>
          <Search shape="simple" placeholder="Search" style={{ width: 232 }} />
        </Shell.Navigation>
        <Shell.Action>
          <HeaderAvatar />
        </Shell.Action>
        {/* <Shell.Navigation>
          <PageNav />
        </Shell.Navigation> */}

        <Shell.Content>{children}</Shell.Content>
        <Shell.Footer>
          <Footer />
        </Shell.Footer>
      </Shell>
    </ConfigProvider>
  );
}
