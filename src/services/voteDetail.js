import { request } from 'ice';

export default {
  async getVote(_id) {
    let rawData = await request({
      url: `/vote/${_id}`,
    });
    let ownerInfo = await request({
      url: `/user/${rawData.owner}`,
    });
    rawData.ownerInfo = ownerInfo;
    for (let idx = 0; idx < rawData.proposals.length; idx++) {
      let proposerInfo = await request({
        url: `/user/${rawData.proposals[idx].proposer}`,
      });
      rawData.proposals[idx].proposerInfo = proposerInfo;
      rawData.proposals[idx].idx = idx + 1;
    }
    return rawData;
  },

  async propose(_id, payload) {
    let rawData = await request({
      url: `/vote/propose/${_id}`,
      method: 'put',
      data: payload,
    });
    let lastPropose = rawData.proposals[rawData.proposals.length - 1];
    let proposerInfo = await request({
      url: `/user/${lastPropose.proposer}`,
    });
    lastPropose.proposerInfo = proposerInfo;
    lastPropose.idx = rawData.proposals.length;
    return lastPropose;
  },

  async nextPeriod(_id, period) {
    return await request({
      url: `/vote/next/${_id}`,
      method: 'put',
      data: { next: period },
    });
  },
};
