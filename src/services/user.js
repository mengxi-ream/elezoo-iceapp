import { request } from 'ice';

export default {
  async getCurrentUser() {
    return await request({
      url: '/user/current',
    });
  },
};
