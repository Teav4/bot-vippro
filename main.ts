import facebookLogin from './index'

(async () => {
  const api = await facebookLogin({
    email: 'nampham.2120@gmail.com',
    password: 'vietanhlolicon13'
  });

  if (!api) {
    return console.log('login failed.')
  }

  const friends = await api.getFriendsList();

  console.log(friends)

})()
