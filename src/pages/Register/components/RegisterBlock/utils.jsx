import { request, history } from 'ice';

export const getToken = ({ account, password }) => {
  console.log('----------1-----');
  return request
    .post('/user/access/login', { account, password })
    .then((res) => {
      // now we get the token
      // const token = res.data;
      const token = res;
      // we can store the token in localStorage for later use
      console.log(token);
      // localStorage.setItem('jwt-token', token);
      // history.push('/');
      return true;
    })
    .catch(() => {
      return false;
    });
};
