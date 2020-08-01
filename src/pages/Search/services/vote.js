import { request } from 'ice';

export default {
  async getVotes(payload) {
    console.log('-----', payload);
    const rawData = await request({
      url: '/vote',
      params: payload,
    });
    // let rawData = await axios({
    //   method: 'get',
    //   url: 'http://127.0.0.1:7001/api/vote',
    //   data: payload,
    //   headers: { Authorization: `Bearer ${localStorage.getItem('jwt-token')}` },
    // });
    for (let idx = 0; idx < rawData.length; idx++) {
      if (rawData[idx].privacyOption === 'anonymity') continue;
      let ownerInfo = await request({ url: `/user/${rawData[idx].owner}` });
      rawData[idx].ownerInfo = ownerInfo;
    }
    return rawData;
  },
};
