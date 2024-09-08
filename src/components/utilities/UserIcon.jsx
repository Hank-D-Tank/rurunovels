import React from 'react';
import Avatar, { genConfig } from 'react-nice-avatar';

const UserIcon = ({ email }) => {
  const seed = email || 'default-image-for-ruru-novels';

  const avatarConfig = {
    ...genConfig(seed),
    sex: 'man',
  hairStyle: "none",
  };


  return (
    <div className="user-icon me-4">
      <Avatar style={{ width: '4.5rem', height: '4.5rem' }} {...avatarConfig} />
    </div>
  );
};

export default UserIcon;
