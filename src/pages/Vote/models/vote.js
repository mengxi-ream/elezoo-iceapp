import { IRootDispatch, request } from 'ice';
import userService from '@/services/user';
import voteService from '@/pages/Vote/services/vote';

export default {
  state: {
    // init: false,
    submit: false,
    fetchTrigger: true,
    items: [
      {
        _id: '1',
        title: '投票',
      },
      {
        _id: '2',
        title: '投票',
      },
      {
        _id: '3',
        title: '投票',
      },
    ],
  },

  reducers: {
    updateSubmit(preState, payload) {
      // console.log('after', !preState.fetchTrigger);
      return { ...preState, submit: payload };
    },
    changeFetchTrigger(preState) {
      // console.log('after', !preState.fetchTrigger);
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
    async changeSubmit(payload) {
      this.updateSubmit(payload);
    },
    async fetchVotes(data) {
      // const data = await voteService.getVotes();
      this.update({ items: data });
    },
  }),
};
