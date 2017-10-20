class StaticUserCodeAdapter {
  upsertCode(userId) {
    return { sub: userId, code: 'ABC123' };
  }

  deleteCode(userId) {
    return true;
  }

  validateCode(userId, code) {
    if (code === 'ABC123') {
      return {
        uid: '23121d3c-84df-44ac-b458-3d63a9a05497',
        code: 'ABC123',
      };
    }
    return null;
  }
}

module.exports = StaticUserCodeAdapter;
