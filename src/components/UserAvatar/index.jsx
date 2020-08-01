import React from 'react';
import { Balloon, Avatar } from '@alifd/next';

const UserAvatar = (props) => {
  const { userName, ...rest } = props;
  return (
    <div>
      {userName ? (
        <Balloon trigger={<Avatar {...rest} />} closable={false} align="t">
          {userName}
        </Balloon>
      ) : (
        <Avatar {...rest} />
      )}
    </div>
  );
};

export default UserAvatar;
