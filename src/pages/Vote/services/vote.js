import { request } from 'ice';

export default {
  async createVote(payload) {
    const rawData = await request({
      url: '/vote/create',
      method: 'post',
      data: payload,
    });
    rawData.period = await request({ url: `/vote/period/${rawData._id}` });
    return rawData;
  },
  async getVotes(payload) {
    const rawData = await request({
      url: '/vote',
      params: payload,
    });

    for (let idx = 0; idx < rawData.items.length; idx++) {
      if (rawData.items[idx].privacyOption === 'anonymity') continue;
      let ownerInfo = await request({ url: `/user/${rawData.items[idx].owner}` });
      rawData.items[idx].ownerInfo = ownerInfo;
    }
    console.log('rawData after', rawData);
    return rawData;
  },
};
