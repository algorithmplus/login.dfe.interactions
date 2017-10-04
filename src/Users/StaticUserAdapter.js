class StaticUserAdapter {
  authenticate(username, password){
    return new Promise((resolve, reject) => {
      if(username.toLowerCase() != 'foo@example.com' || !password || password.length < 1) {
        return resolve(null);
      }

      return resolve({
        id: '23121d3c-84df-44ac-b458-3d63a9a05497'
      });
    });
  }
}

module.exports = StaticUserAdapter;