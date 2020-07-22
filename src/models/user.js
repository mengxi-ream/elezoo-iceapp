import { IRootDispatch } from 'ice';
import userServices from '@/services/user';

export default {
  state: {
    // init: false,
    avatar: '/public/defaultAvatar.webp',
  },

  reducers: {
    // updateInit(preState, newInit) {
    //   preState.init = newInit;
    // },
    update(preState, payload) {
      return { ...preState, ...payload };
    },
  },

  effects: (dispatch) => ({
    async fetchUserInfo() {
      const data = await userServices.getCurrentUser();
      //this.update(data)
      dispatch.user.update(data);
    },
  }),
};
