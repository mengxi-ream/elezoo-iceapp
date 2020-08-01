import { IRootDispatch, request } from 'ice';
import userService from '@/services/user';
import voteService from '@/pages/Vote/services/vote';

export default {
  state: {
    // init: false,
    current: 1,
    pageSize: 5,
    total: 2,
    items: [
      {
        _id: '1',
        title: '投票',
      },
      {
        _id: '2',
        title: '投票',
      },
    ],
  },

  reducers: {
    update(preState, payload) {
      return { ...preState, ...payload };
    },
  },

  effects: (dispatch) => ({
    async fetchVotes(data) {
      // const data = await voteService.getVotes();
      this.update({ items: data });
    },
    async fetchTotal(total) {
      this.update({ total });
    },
    async updateCurrent(current) {
      this.update({ current });
    },
  }),
};
