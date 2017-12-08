
const upsertCode = async userId => ({ sub: userId, code: 'ABC123' });

const deleteCode = async () => true;

const validateCode = async (userId, code) => {
  if (userId && code === 'ABC123') {
    return {
      uid: '23121d3c-84df-44ac-b458-3d63a9a05497',
      code: 'ABC123',
    };
  }
  return null;
};

const getCode = async userId => ({
  uid: '23121d3c-84df-44ac-b458-3d63a9a05497',
  code: 'ABC123',
  redirectUri: 'http://localhost.test',
});

module.exports = {
  upsertCode,
  deleteCode,
  validateCode,
  getCode,
};

