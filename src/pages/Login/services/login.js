import { request } from 'ice';

export default {
  async getToken({ account, password }) {
    return await request({
      url: '/user/login',
      method: 'post',
      data: { account, password },
    });
  },
};
