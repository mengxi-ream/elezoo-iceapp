import { IRootDispatch, request } from 'ice';
import userServices from '@/services/user';
// import axios from 'axios';

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
      dispatch.user.update(data);
    },
  }),
};
