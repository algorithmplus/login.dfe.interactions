const authenticate = async (username, password) => {
  if (username.toLowerCase() === 'foo' && password === 'password') {
    return {
      email: 'foo@example.com',
      firstName: 'Roger',
      lastName: 'Johnson',
    };
  }
  return null;
};

module.exports = {
  authenticate,
};
