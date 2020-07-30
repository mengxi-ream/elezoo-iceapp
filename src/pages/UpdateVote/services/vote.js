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
};
