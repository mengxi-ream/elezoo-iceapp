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
    addProposal(preState, newProposal) {
      let newState = preState;
      newState.proposals.push(newProposal);
      console.log('newState', newState.proposals);
      return newState;
    },
    updateProposal(preState, newVoteState) {
      return newVoteState;
    },
  },

  effects: (dispatch) => ({
    async fetchVote(data) {
      this.updateVote(data);
    },
    async addProposal(newProposal) {
      this.addProposal(newProposal);
    },
    async updateProposals(newVoteState) {
      this.updateProposals(newVoteState);
    },
  }),
};
