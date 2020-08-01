import { request } from 'ice';
import Forget from '@/pages/Forget';

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

  async forget(payload) {
    return await request({
      url: '/user/forget',
      method: 'patch',
      data: payload,
    });
  },

  async reset(_id, payload) {
    return await request({
      url: `/user/reset/${_id}`,
      method: 'patch',
      data: payload,
    });
  },
};
