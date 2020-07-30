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
    // hasVoted
    let hasVoted = await request({
      url: `/vote/hasvoted/${_id}`,
    });
    rawData.hasVoted = hasVoted;
    // add more user info
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
        // console.log('suppoter', supporterInfo);
        rawData.proposals[idx].votes[voteIdx].supporterInfo = supporterInfo;
      }
      if (rawData.proposals[idx].privacy === 'anonymity') continue;
      let proposerInfo = await request({
        url: `/user/${rawData.proposals[idx].proposer}`,
      });
      rawData.proposals[idx].proposerInfo = proposerInfo;
    }
    for (let idx = 0; idx < rawData.proposals.length; idx++) {
      if (totalVotes === 0) {
        rawData.proposals[idx].percent = 0;
        continue;
      }
      rawData.proposals[idx].percent =
        rawData.proposals[idx].subtotalVotes / totalVotes;
    }
    rawData.totalVotes = totalVotes;
    return rawData;
  },

  // async propose(_id, payload, currentUserInfo) {
  //   let rawData = await request({
  //     url: `/vote/propose/${_id}`,
  //     method: 'put',
  //     data: payload,
  //   });
  //   // create a fake new entry to save the computational time
  //   const { content, privacy = 'realName' } = payload;
  //   let lastPropose = {
  //     idx: rawData.proposals.length,
  //     content,
  //     privacy,
  //     createAt: new Date(),
  //   };
  //   if (privacy !== 'anonymity') {
  //     lastPropose.proposer = currentUserInfo._id;
  //     lastPropose.proposerInfo = currentUserInfo;
  //   }
  //   console.log('lastPropose', lastPropose);
  //   return lastPropose;
  // },

  async propose(_id, payload) {
    let rawData = await request({
      url: `/vote/propose/${_id}`,
      method: 'put',
      data: payload,
    });
    for (let idx = 0; idx < rawData.proposals.length; idx++) {
      rawData.proposals[idx].idx = idx + 1;
      if (rawData.proposals[idx].privacy === 'anonymity') continue;
      let proposerInfo = await request({
        url: `/user/${rawData.proposals[idx].proposer}`,
      });
      rawData.proposals[idx].proposerInfo = proposerInfo;
    }
    return rawData.proposals;
  },

  async deleteProposal(_id, payload) {
    let rawData = await request({
      url: `/vote/proposal/${_id}`,
      method: 'delete',
      data: payload,
    });
    return payload.proposalId;
  },

  async vote(_id, payload, voteState, idxList, currentUserInfo) {
    let rawData = await request({
      url: `vote/vote/${_id}`,
      method: 'put',
      data: payload,
    });
    const { privacy = 'realName' } = payload;
    // 深拷贝，不然 voteState 是不可修改的，不能 push
    let newVoteState = JSON.parse(JSON.stringify(voteState));
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
    for (let idx = 0; idx < newVoteState.proposals.length; idx++) {
      if (newVoteState.totalVotes === 0) {
        newVoteState.proposals[idx].percent = 0;
        continue;
      }
      newVoteState.proposals[idx].percent =
        newVoteState.proposals[idx].subtotalVotes / newVoteState.totalVotes;
    }
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
