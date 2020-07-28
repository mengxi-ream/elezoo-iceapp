import { IRootDispatch, request } from 'ice';
import { updateLocale } from 'moment';

export default {
  state: {
    // init: false,
  },

  reducers: {
    updateVote(preState, payload) {
      return payload;
    },
  },

  effects: (dispatch) => ({
    async fetchVote(data) {
      this.updateVote(data);
    },
  }),
};
