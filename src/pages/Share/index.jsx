import React, { useEffect } from 'react';
import {
  useParams,
  useSearchParams,
  useHistory,
  history,
  useRequest,
} from 'ice';
import { ResponsiveGrid, Message } from '@alifd/next';
import voteDetailService from '@/services/voteDetail';
import urlParse from 'url-parse';

const { Cell } = ResponsiveGrid;

console.log(history);

const pathname = history.location.pathname;

if (
  !localStorage.hasOwnProperty('jwt-token') &&
  pathname != '/user/login' &&
  pathname != '/user/resetpsw' &&
  pathname.match('/vote/share')
) {
  let voteId = pathname.match('[^/]+(?!.*/)')[0];
  history.push(`/user/register/${voteId}${history.location.search}`);
}

const VoteNotStarted = () => {
  const history = useHistory();
  const { uuid } = useSearchParams();
  const { id } = useParams();

  const { data, loading, request } = useRequest(voteDetailService.acceptShare, {
    onSuccess: async (result) => {
      console.log(result);
      console.log(`/vote/${result.period}/${id}`);
      history.push(`/vote/${result.period}/${id}`);
      // Message.success('加载成功');
    },
    onError: (err) => {
      err.response
        ? Message.error(err.response.data.message)
        : Message.error('加载失败');
      history.push('/');
    },
  });

  useEffect(() => {
    request(id, uuid);
  }, []);
  return (
    <ResponsiveGrid gap={20}>
      <Cell colSpan={12}></Cell>
    </ResponsiveGrid>
  );
};

export default VoteNotStarted;
