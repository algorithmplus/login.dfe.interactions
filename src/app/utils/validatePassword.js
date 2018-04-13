'use strict';

const { passwordPolicy } = require('login.dfe.validation');

const validate = (newPassword, confirmPassword) => {
  const messages = {};
  let failed = false;

  if (newPassword.length === 0) {
    messages.newPassword = 'Please enter a password';
    failed = true;
  } else if (!passwordPolicy.doesPasswordMeetPolicy(newPassword)) {
    messages.newPassword = 'Please enter a password of at least 12 characters';
    failed = true;
  }

  if (confirmPassword.length === 0) {
    messages.confirmPassword = 'Please confirm your new password';
    failed = true;
  } else if (newPassword !== confirmPassword) {
    messages.confirmPassword = 'Please enter matching passwords';
    failed = true;
  }

  return {
    failed,
    messages,
  };
};

module.exports = {
  validate,
};
