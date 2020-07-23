import { request } from 'ice';

export default {
  async getCurrentUser() {
    return await request({
      url: '/user/current',
    });
  },

  async getToken({ account, password }) {
    return await request({
      url: '/user/login',
      method: 'post',
      data: { account, password },
    });
  },

  async createUser(info) {
    return await request({
      url: '/user/create',
      method: 'post',
      data: info,
    });
  },

  async updateBasic(payload) {
    return await request({
      url: '/user',
      method: 'put',
      data: payload,
    });
  },

  async updatePsw({ oldPassword, password }) {
    return await request({
      url: '/user/password',
      method: 'put',
      data: { oldPassword, password },
    });
  },
};
