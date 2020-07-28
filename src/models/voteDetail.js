import { IRootDispatch, request } from 'ice';
import { updateLocale } from 'moment';

export default {
  state: {
    // init: false,
    proposals: [],
  },

  reducers: {
    updateVote(preState, payload) {
      return payload;
    },
    updateProposal(preState, newProposal) {
      let newState = preState;
      newState.proposals.push(newProposal);
      console.log('newState', newState.proposals);
      return newState;
    },
  },

  effects: (dispatch) => ({
    async fetchVote(data) {
      this.updateVote(data);
    },
    async addProposal(newProposal) {
      this.updateProposal(newProposal);
    },
  }),
};
