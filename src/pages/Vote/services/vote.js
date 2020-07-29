import { request } from 'ice';
import CreateVote from '../components/VoteBlock/CreateVote';

export default {
  async createVote(payload) {
    return await request({
      url: '/vote/create',
      method: 'post',
      data: payload,
    });
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
