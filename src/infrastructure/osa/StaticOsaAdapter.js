const authenticate = async (username, password) => {
  if (username.toLowerCase() === 'foo' && password === 'password') {
    return {
      username: 'foo',
      email: 'foo@example.com',
      firstName: 'Roger',
      lastName: 'Johnson',
      organisation: {
        id: '72711ff9-2da1-4135-8a20-3de1fea31073',
        name: 'Department for Education - Local Authority',
        urn: null,
        localAuthority: '001',
        type: '002',
        uid: null,
      },
    };
  } else if (username.toLowerCase() === 'foo2' && password === 'password') {
    return {
      username: 'foo2',
      email: '',
      firstName: 'Roger',
      lastName: 'Johnson',
      organisation: {
        id: '72711ff9-2da1-4135-8a20-3de1fea31073',
        name: 'Some School - Establishment',
        urn: '138711',
        localAuthority: null,
        type: '001',
        uid: null,
      },
    };
  } else if (username.toLowerCase() === 'foo3' && password === 'password') {
    return {
      username: 'foo3',
      email: 'foo3@example.com',
      firstName: 'Roger',
      lastName: 'Johnson',
      organisation: {
        id: '72711ff9-2da1-4135-8a20-3de1fea31073',
        name: 'Some School - SAT',
        urn: null,
        localAuthority: null,
        type: '013',
        uid: 'SAT12345',
      },
    };
  } else if (username.toLowerCase() === 'foo4' && password === 'password') {
    return {
      username: 'foo4',
      email: 'foo3@example.com',
      firstName: 'Roger',
      lastName: 'Johnson',
      organisation: {
        id: '72711ff9-2da1-4135-8a20-3de1fea31073',
        name: 'Some School - MAT',
        urn: null,
        localAuthority: null,
        type: '010',
        uid: 'MAT1234',
      },
    };
  }
  return null;
};

module.exports = {
  authenticate,
};
