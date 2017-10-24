const get = () => {
  return {
    rules: [
      {
        pattern: '^.{12,64}$',
        description: 'Password must contain at least 12 characters and no more than 64',
      },
    ],
    guidance: [
      'Use a number of words that you will find easy to remember',
      'Don\'t use the same password as other applications',
      'Don\'t you the names or date of births of you or family members',
    ],
  };
};

module.exports = {
  get,
};
