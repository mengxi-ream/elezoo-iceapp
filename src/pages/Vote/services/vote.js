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
    return await request({
      url: '/vote',
    });
  },
};
