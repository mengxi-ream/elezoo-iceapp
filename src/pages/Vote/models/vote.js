import { IRootDispatch, request } from 'ice';
import userService from '@/services/user';
import voteService from '@/pages/Vote/services/vote';

export default {
  state: {
    // init: false,
    fetchTrigger: true,
    items: [
      {
        _id: '1',
        title: 'haha',
      },
    ],
  },

  reducers: {
    changeFetchTrigger(preState) {
      console.log('after', !preState.fetchTrigger);
      return { ...preState, fetchTrigger: !preState.fetchTrigger };
    },
    update(preState, payload) {
      return { ...preState, ...payload };
    },
  },

  effects: (dispatch) => ({
    async prepareFetch() {
      this.changeFetchTrigger();
    },
    async fetchVotes(data) {
      // const data = await voteService.getVotes();
      this.update({ items: data });
    },
  }),
};
