class StaticUserCodeAdapter {
  upsertCode(username) {
    return { sub: username, code: 'ABC123' };
  }

  deleteCode(username) {
    return true;
  }

  validateCode(username, code) {
    if(code === 'ABC123') {
      return true;
    }
    return false;
  }
}

module.exports = StaticUserCodeAdapter;
