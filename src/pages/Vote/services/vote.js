import { request } from 'ice';
import CreateVote from '../components/VoteBlock/CreateVote';

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
  async getVotes() {
    let rawData = await request({
      url: '/vote',
    });
    for (let idx = 0; idx < rawData.length; idx++) {
      if (rawData[idx].privacyOption === 'anonymity') continue;
      let ownerInfo = await request({ url: `/user/${rawData[idx].owner}` });
      rawData[idx].ownerInfo = ownerInfo;
    }
    return rawData;
  },
};
