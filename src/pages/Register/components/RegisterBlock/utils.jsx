import { request, history } from 'ice';

export const createUser = (info) => {
  return request
    .post('/user/signup', info)
    .then((res) => {
      // we can store the token in localStorage for later use
      console.log(res);
      // history.push('/');
      return true;
    })
    .catch(() => {
      return false;
    });
};
