import React from 'react';

const ProfileSummary = ({ user }) => (
  <div data-testid="profile-summary">
    <h2>Profile Summary</h2>
    <p>{user.name}</p>
  </div>
);

export default ProfileSummary;
