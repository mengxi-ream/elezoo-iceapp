import { request, store } from 'ice';
import vote from '@/pages/Vote/services/vote';

export default {
  async getVote(_id) {
    let rawData = await request({
      url: `/vote/${_id}`,
    });
    let ownerInfo = await request({
      url: `/user/${rawData.owner}`,
    });
    rawData.ownerInfo = ownerInfo;
    // console.log(rawData);
    let totalVotes = 0;
    for (let idx = 0; idx < rawData.proposals.length; idx++) {
      rawData.proposals[idx].idx = idx + 1;
      const votes = rawData.proposals[idx].votes;
      rawData.proposals[idx].subtotalVotes = votes.length;
      totalVotes += votes.length;
      for (let voteIdx = 0; voteIdx < votes.length; voteIdx++) {
        if (votes[voteIdx].privacy === 'anonymity') continue;
        let supporterInfo = await request({
          url: `/user/${votes[voteIdx].supporter}`,
        });
        console.log('suppoter', supporterInfo);
        rawData.proposals[idx].votes[voteIdx].supporterInfo = supporterInfo;
      }
      if (rawData.proposals[idx].privacy === 'anonymity') continue;
      let proposerInfo = await request({
        url: `/user/${rawData.proposals[idx].proposer}`,
      });
      rawData.proposals[idx].proposerInfo = proposerInfo;
    }
    rawData.totalVotes = totalVotes;
    return rawData;
  },

  async propose(_id, payload, currentUserInfo) {
    let rawData = await request({
      url: `/vote/propose/${_id}`,
      method: 'put',
      data: payload,
    });
    // create a fake new entry to save the computational time
    const { content, privacy = 'realName' } = payload;
    let lastPropose = {
      idx: rawData.proposals.length,
      content,
      privacy,
      createAt: new Date(),
    };
    if (privacy !== 'anonymity') {
      lastPropose.proposer = currentUserInfo._id;
      lastPropose.proposerInfo = currentUserInfo;
    }
    return lastPropose;
  },

  async vote(_id, payload, voteState, idxList, currentUserInfo) {
    let rawData = await request({
      url: `vote/vote/${_id}`,
      method: 'put',
      data: payload,
    });
    const { privacy = 'realName' } = payload;
    let newVoteState = voteState;
    idxList.forEach((idx) => {
      let lastVote = {
        _id: idx, // fake _id
        privacy,
        createAt: new Date(),
      };
      if (privacy !== 'anonymity') {
        lastVote.supporter = currentUserInfo._id;
        lastVote.supporterInfo = currentUserInfo;
      }
      newVoteState.proposals[idx - 1].votes.push(lastVote);
      newVoteState.proposals[idx - 1].subtotalVotes += 1;
      newVoteState.totalVotes += 1;
    });
    return newVoteState;
  },

  async nextPeriod(_id, period) {
    return await request({
      url: `/vote/next/${_id}`,
      method: 'put',
      data: { next: period },
    });
  },
};
