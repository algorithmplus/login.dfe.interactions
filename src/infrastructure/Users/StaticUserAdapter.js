const authenticate = async (username, password) => {
  if (username.toLowerCase() !== 'foo@example.com' || !password || password.length < 1) {
    return null;
  }
  return { id: '23121d3c-84df-44ac-b458-3d63a9a05497' };
};

const find = async (username) => {
  if (username.toLowerCase() !== 'foo@example.com') {
    return null;
  }
  return { id: '23121d3c-84df-44ac-b458-3d63a9a05497' };
};

const changePassword = async (uid, password) => Promise.resolve(null);

const getDevices = async (uid) => {
  if (uid === '23121d3c-84df-44ac-b458-3d63a9a05497') {
    return [
      {
        id: 'b9e41652-1d1c-47bb-ba34-204243203db2',
        type: 'digipass',
        serialNumber: '123456',
      },
    ];
  } else if (uid === 'bfa93e30-48b5-4942-b45d-8cf9ece5b7e9') {
    return [
      {
        id: '82ece83b-5901-4c8c-b3e9-3c81439eb384',
        type: 'authenticator',
        serialNumber: '123456',
      },
    ];
  }

  return [];
};

const create = async () =>{
  return Promise.resolve({ id: '33421d3e-54ba-44ac-c453-2d42b9a05492' });
};

const update = async () =>{
  return Promise.resolve();
};

const findByLegacyUsername = async (username) => {
  if (username.toLowerCase() !== 'foo2@example.com') {
    return null;
  }
  return { id: '23121d3c-84df-44ac-b458-3d63a9a05497' };
};

module.exports = {
  authenticate,
  find,
  changePassword,
  getDevices,
  create,
  findByLegacyUsername,
  update,
};
