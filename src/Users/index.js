class UserService {
  authenticate(username, password){
    if(username.toLowerCase() != 'foo@example.com' || !password || password.length < 1) {
      return null;
    }

    return {
      id: '23121d3c-84df-44ac-b458-3d63a9a05497'
    }
  }
}

module.exports = new UserService();