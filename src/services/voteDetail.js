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
    return rawData;
  },
};
