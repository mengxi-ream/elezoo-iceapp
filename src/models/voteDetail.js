import { IRootDispatch, request } from 'ice';
import { updateLocale } from 'moment';

export default {
  state: {
    // init: false,
    proposals: [],
  },

  reducers: {
    updateVote(preState, payload) {
      //prevent some value payloads don't have
      return payload;
    },
    updatePartVote(preState, payload) {
      return { ...preState, ...payload };
    },
    updateProposals(preState, newProposals) {
      // preState.proposals.push(newProposal);
      return { ...preState, proposals: newProposals };
    },
    updateSupporter(preState, newVoteState) {
      return newVoteState;
    },
    removeProposal(preState, proposalId) {
      for (let idx = 0; idx < preState.proposals.length; idx++) {
        if (preState.proposals[idx]._id.toString() !== proposalId) continue;
        preState.proposals.splice(idx, 1);
        break;
      }
      // return preState;
    },
  },

  effects: (dispatch) => ({
    async fetchVote(data) {
      this.updateVote(data);
    },
    async addProposal(newProposals) {
      this.updateProposals(newProposals);
    },
    async addSupporter(newVoteState) {
      this.updateSupporter(newVoteState);
    },
    async updatePeriod(newPeriod) {
      this.updatePartVote({ period: newPeriod });
    },
    async deleteProposal(proposalId) {
      this.removeProposal(proposalId);
    },
  }),
};
